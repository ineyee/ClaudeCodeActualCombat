// background.js - Service Worker

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

// Setup on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'ocr-select',
    title: 'OCR 選取區域',
    contexts: ['all']
  });
});

// Keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'activate-ocr') {
    activateOverlay();
  }
});

// Context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ocr-select') {
    activateOverlay();
  }
});

async function activateOverlay() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  // Content scripts can't run on chrome:// or extension pages
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_OVERLAY' });
  } catch (e) {
    // Content script not yet injected — inject it first then retry
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/overlay.js']
    });
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['content/overlay.css']
    });
    chrome.tabs.sendMessage(tab.id, { type: 'SHOW_OVERLAY' });
  }
}

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_REGION') {
    handleCaptureRegion(message, sender.tab).then(sendResponse);
    return true;
  }
  if (message.type === 'OCR') {
    handleOCR(message.dataUrl).then(sendResponse);
    return true;
  }
  if (message.type === 'TRANSLATE') {
    handleTranslate(message.text).then(sendResponse);
    return true;
  }
});

async function handleOCR(dataUrl) {
  try {
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });
    if (existingContexts.length === 0) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['DOM_PARSER'],
        justification: 'Run Tesseract.js OCR'
      });
    }
    // Wrap in timeout to avoid hanging forever
    return await Promise.race([
      chrome.runtime.sendMessage({ type: 'OCR_OFFSCREEN', dataUrl }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('OCR timeout after 60s')), 60000))
    ]);
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function handleCaptureRegion({ rect, dpr }, tab) {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
    const croppedDataUrl = await cropImage(dataUrl, rect, dpr);
    return { success: true, dataUrl: croppedDataUrl };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function cropImage(dataUrl, rect, dpr) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const img = await createImageBitmap(blob);

  const x = Math.round(rect.x * dpr);
  const y = Math.round(rect.y * dpr);
  const w = Math.round(rect.width * dpr);
  const h = Math.round(rect.height * dpr);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

  const croppedBlob = await canvas.convertToBlob({ type: 'image/png' });
  return blobToDataUrl(croppedBlob);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function handleTranslate(text) {
  try {
    const { apiKey } = await chrome.storage.local.get('apiKey');
    if (!apiKey) {
      return { success: false, error: 'No API key set. Please open Settings.' };
    }

    const prompt = `For the English word or phrase: "${text.trim()}"
Return a JSON object with exactly these fields:
- word: the word/phrase (normalized, lowercase)
- chinese: Chinese translation
- pos: part of speech (noun/verb/adjective/adverb/etc)
- example: a natural English example sentence using this word
- example_zh: Chinese translation of the example sentence

Return only valid JSON, no markdown, no explanation.`;

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.error?.message || 'API error' };
    }

    const data = await response.json();
    const content = data.content[0].text.trim();
    const card = JSON.parse(content);
    card.createdAt = Date.now();
    card.pinned = false;

    // Save to storage
    const { words = [] } = await chrome.storage.local.get('words');
    words.unshift(card);
    await chrome.storage.local.set({ words });

    return { success: true, card };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
