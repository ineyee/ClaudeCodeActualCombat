// pages/wordlist.js

async function loadWords() {
  const { words = [] } = await chrome.storage.local.get('words');
  return words;
}

async function saveWords(words) {
  await chrome.storage.local.set({ words });
}

function render(words) {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const count = document.getElementById('count');

  count.textContent = words.length ? `${words.length} 個單字` : '';

  if (!words.length) {
    empty.style.display = 'block';
    grid.innerHTML = '';
    return;
  }

  empty.style.display = 'none';

  // Pinned first
  const sorted = [...words].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  grid.innerHTML = sorted.map((card, idx) => `
    <div class="card ${card.pinned ? 'pinned' : ''}" data-word="${escapeAttr(card.word)}">
      ${card.pinned ? '<span class="pin-badge">📌</span>' : ''}
      <div class="card-word">${escape(card.word)}</div>
      <div class="card-pos">${escape(card.pos)}</div>
      <div class="card-chinese">${escape(card.chinese)}</div>
      <div class="card-example">${escape(card.example)}</div>
      <div class="card-example-zh">${escape(card.example_zh)}</div>
      <div class="card-actions">
        <button class="btn btn-pin ${card.pinned ? 'active' : ''}" data-action="pin" data-word="${escapeAttr(card.word)}">
          ${card.pinned ? '取消置頂' : '置頂'}
        </button>
        <button class="btn btn-delete" data-action="delete" data-word="${escapeAttr(card.word)}">刪除</button>
      </div>
    </div>
  `).join('');
}

function escape(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return String(str || '').replace(/"/g, '&quot;');
}

document.getElementById('grid').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const word = btn.dataset.word;
  let words = await loadWords();

  if (action === 'delete') {
    words = words.filter(c => c.word !== word);
  } else if (action === 'pin') {
    words = words.map(c => c.word === word ? { ...c, pinned: !c.pinned } : c);
  }

  await saveWords(words);
  render(words);
});

// Initial load
loadWords().then(render);

// Listen for storage changes (new words added while page is open)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.words) render(changes.words.newValue || []);
});
