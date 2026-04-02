// offscreen.js - runs Tesseract OCR in an offscreen document (has window, no CSP issues)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OCR_OFFSCREEN') {
    runOCR(message.dataUrl).then(sendResponse);
    return true;
  }
});

async function runOCR(dataUrl) {
  try {
    const base = chrome.runtime.getURL('lib/tesseract/');
    console.log('[OCR] starting, base:', base);
    const worker = Tesseract.createWorker({
      workerPath: base + 'worker.min.js',
      langPath: base,
      corePath: base + 'tesseract-core.wasm.js',
      logger: (m) => console.log('[Tesseract]', m.status, m.progress)
    });
    console.log('[OCR] loading worker...');
    await worker.load();
    console.log('[OCR] loading language...');
    await worker.loadLanguage('eng');
    console.log('[OCR] initializing...');
    await worker.initialize('eng');
    console.log('[OCR] recognizing...');
    const { data: { text } } = await worker.recognize(dataUrl);
    console.log('[OCR] done:', text);
    await worker.terminate();
    return { success: true, text };
  } catch (err) {
    console.error('[OCR] error:', err);
    return { success: false, error: err.message };
  }
}
