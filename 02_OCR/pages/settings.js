// pages/settings.js

const input = document.getElementById('api-key');
const status = document.getElementById('status');

// Load existing key
chrome.storage.local.get('apiKey', ({ apiKey }) => {
  if (apiKey) input.value = apiKey;
});

document.getElementById('btn-save').addEventListener('click', async () => {
  const key = input.value.trim();
  if (!key) {
    showStatus('請輸入 API Key', 'error');
    return;
  }
  if (!key.startsWith('sk-ant-')) {
    showStatus('格式不正確，應以 sk-ant- 開頭', 'error');
    return;
  }
  await chrome.storage.local.set({ apiKey: key });
  showStatus('已儲存', 'success');
});

document.getElementById('btn-clear').addEventListener('click', async () => {
  await chrome.storage.local.remove('apiKey');
  input.value = '';
  showStatus('已清除', 'success');
});

function showStatus(msg, type) {
  status.textContent = msg;
  status.className = type;
  setTimeout(() => { status.textContent = ''; status.className = ''; }, 3000);
}
