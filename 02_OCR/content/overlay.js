// content/overlay.js

(function () {
  // Prevent double injection
  if (window.__ocrOverlayLoaded) return;
  window.__ocrOverlayLoaded = true;

  let overlayActive = false;

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'SHOW_OVERLAY' && !overlayActive) {
      showOverlay();
    }
  });

  function showOverlay() {
    overlayActive = true;

    const overlay = document.createElement('div');
    overlay.id = '__ocr-overlay';

    const selection = document.createElement('div');
    selection.id = '__ocr-selection';
    overlay.appendChild(selection);

    const hint = document.createElement('div');
    hint.id = '__ocr-hint';
    hint.textContent = '拖曳選取包含英文單字的區域，按 Esc 取消';
    overlay.appendChild(hint);

    document.body.appendChild(overlay);

    let startX = 0, startY = 0;
    let isDragging = false;

    function onMouseDown(e) {
      e.preventDefault();
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      selection.style.left = startX + 'px';
      selection.style.top = startY + 'px';
      selection.style.width = '0';
      selection.style.height = '0';
      selection.style.display = 'block';
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      const x = Math.min(e.clientX, startX);
      const y = Math.min(e.clientY, startY);
      const w = Math.abs(e.clientX - startX);
      const h = Math.abs(e.clientY - startY);
      selection.style.left = x + 'px';
      selection.style.top = y + 'px';
      selection.style.width = w + 'px';
      selection.style.height = h + 'px';
    }

    function onMouseUp(e) {
      if (!isDragging) return;
      isDragging = false;

      const rect = {
        x: parseInt(selection.style.left),
        y: parseInt(selection.style.top),
        width: parseInt(selection.style.width),
        height: parseInt(selection.style.height)
      };

      if (rect.width < 10 || rect.height < 10) {
        cleanup();
        return;
      }

      showStatus('正在截圖...');

      chrome.runtime.sendMessage(
        { type: 'CAPTURE_REGION', rect, dpr: window.devicePixelRatio || 1 },
        (response) => {
          if (!response || !response.success) {
            showStatus('截圖失敗: ' + (response?.error || '未知錯誤'), true);
            setTimeout(cleanup, 2000);
            return;
          }
          runOCR(response.dataUrl);
        }
      );
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') cleanup();
    }

    overlay.addEventListener('mousedown', onMouseDown);
    overlay.addEventListener('mousemove', onMouseMove);
    overlay.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeyDown);

    function cleanup() {
      overlay.removeEventListener('mousedown', onMouseDown);
      overlay.removeEventListener('mousemove', onMouseMove);
      overlay.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keydown', onKeyDown);
      overlay.remove();
      overlayActive = false;
    }

    function showStatus(text, isError = false) {
      hint.textContent = text;
      hint.style.background = isError ? 'rgba(200,50,50,0.9)' : 'rgba(0,0,0,0.75)';
    }

    async function runOCR(dataUrl) {
      showStatus('正在識別文字...');
      // Send image to background for OCR (avoids page CSP restrictions)
      chrome.runtime.sendMessage({ type: 'OCR', dataUrl }, (response) => {
        if (!response || !response.success) {
          showStatus('OCR 失敗: ' + (response?.error || '未知錯誤'), true);
          setTimeout(cleanup, 3000);
          return;
        }
        const cleanText = response.text.trim().replace(/\s+/g, ' ');
        if (!cleanText) {
          showStatus('未識別到文字，請重試', true);
          setTimeout(cleanup, 2000);
          return;
        }
        showStatus(`識別到: "${cleanText}" — 正在翻譯...`);
        chrome.runtime.sendMessage({ type: 'TRANSLATE', text: cleanText }, (res) => {
          if (!res || !res.success) {
            showStatus('翻譯失敗: ' + (res?.error || '未知錯誤'), true);
            setTimeout(cleanup, 3000);
            return;
          }
          showToast(res.card, cleanup);
        });
      });
    }

    function showToast(card, onDone) {
      hint.innerHTML = `
        <strong>${card.word}</strong> <em style="opacity:0.7">${card.pos}</em><br>
        ${card.chinese}<br>
        <small style="opacity:0.8">已儲存到單字卡</small>
      `;
      hint.style.fontSize = '15px';
      hint.style.lineHeight = '1.6';
      selection.style.display = 'none';
      overlay.style.background = 'transparent';
      overlay.style.pointerEvents = 'none';
      setTimeout(onDone, 3000);
    }
  }
})();
