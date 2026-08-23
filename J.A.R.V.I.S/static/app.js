const state = {
  conversations: JSON.parse(localStorage.getItem('jarvis-conversations') || '[]'),
  current: JSON.parse(localStorage.getItem('jarvis-current') || '[]'),
  remember: localStorage.getItem('jarvis-remember') !== 'false',
  profile: JSON.parse(localStorage.getItem('jarvis-profile') || '{"name":"Harshey Golar","note":"Personal workspace"}')
};
const $ = (selector) => document.querySelector(selector);
const messages = $('#messages');
const welcome = $('#welcomeState');
const input = $('#messageInput');
const thinking = $('#thinkingRow');

if (typeof marked !== 'undefined') {
  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: false,
    mangle: false
  });
}

function initials(name) { return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(); }
function saveState() {
  if (state.remember) { localStorage.setItem('jarvis-conversations', JSON.stringify(state.conversations)); localStorage.setItem('jarvis-current', JSON.stringify(state.current)); }
  else { localStorage.removeItem('jarvis-conversations'); localStorage.removeItem('jarvis-current'); }
  localStorage.setItem('jarvis-remember', state.remember);
}
function renderConversations(filter = '') {
  const list = $('#conversationList');
  const filtered = state.conversations.filter(item => item.title.toLowerCase().includes(filter.toLowerCase()));
  $('#conversationCount').textContent = filtered.length;
  list.innerHTML = filtered.length ? filtered.map(item => `<button class="conversation-item ${item.id === state.activeId ? 'active' : ''}" data-id="${item.id}">${escapeHtml(item.title)}</button>`).join('') : '<p class="empty-list">No conversations yet</p>';
  list.querySelectorAll('.conversation-item').forEach(button => button.addEventListener('click', () => loadConversation(button.dataset.id)));
}
function escapeHtml(text) { return text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])); }
function renderMarkdown(content) {
  const text = String(content || '');

  if (typeof marked !== 'undefined') {
    try {
      return marked.parse(text, { breaks: false, gfm: true });
    } catch (error) {
      console.warn('Markdown rendering failed:', error);
    }
  }

  return renderBasicMarkdown(text);
}

function renderBasicMarkdown(markdown) {
  let text = escapeHtml(String(markdown || ''));

  // Code blocks
  text = text.replace(
    /```([\s\S]*?)```/g,
    (_, code) => `<pre><code>${code.trim()}</code></pre>`
  );

  // Headings
  text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  text = text.replace(
    /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
    '<em>$1</em>'
  );

  // Inline code
  text = text.replace(
    /`([^`\n]+)`/g,
    '<code>$1</code>'
  );

  // Links
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Blockquotes
  text = text.replace(
    /^&gt; (.+)$/gm,
    '<blockquote>$1</blockquote>'
  );

  // Unordered lists
  text = text.replace(
    /(?:^|\n)((?:[-*+] .+(?:\n|$))+)/g,
    (_, block) => {
      const items = block
        .trim()
        .split('\n')
        .map(item => item.replace(/^[-*+] /, '').trim())
        .filter(Boolean)
        .map(item => `<li>${item}</li>`)
        .join('');

      return `\n<ul>${items}</ul>\n`;
    }
  );

  // Ordered lists
  text = text.replace(
    /(?:^|\n)((?:\d+\. .+(?:\n|$))+)/g,
    (_, block) => {
      const items = block
        .trim()
        .split('\n')
        .map(item => item.replace(/^\d+\. /, '').trim())
        .filter(Boolean)
        .map(item => `<li>${item}</li>`)
        .join('');

      return `\n<ol>${items}</ol>\n`;
    }
  );

  // Paragraphs
  const blocks = text
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean);

  return blocks
    .map(block => {
      if (
        block.startsWith('<h1>') ||
        block.startsWith('<h2>') ||
        block.startsWith('<h3>') ||
        block.startsWith('<ul>') ||
        block.startsWith('<ol>') ||
        block.startsWith('<pre>') ||
        block.startsWith('<blockquote>')
      ) {
        return block;
      }

      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
}
function highlightCodeBlocks() {
  if (typeof hljs !== 'undefined') {
    messages.querySelectorAll('pre code').forEach((block) => hljs.highlightElement(block));
  }
}
function renderMessages() {
  welcome.hidden = state.current.length > 0;
  messages.innerHTML = state.current.map((message) => {
    const safeText = escapeHtml(String(message.content || ''));
    const renderedContent = message.role === 'assistant' ? renderMarkdown(message.content) : safeText;
    return `<article class="message ${message.role}"><span class="message-avatar">${message.role === 'user' ? initials(state.profile.name) : 'J'}</span><div class="message-content ${message.role === 'assistant' ? 'markdown-body' : ''}">${renderedContent}</div></article>`;
  }).join('');
  highlightCodeBlocks();
  $('#chatArea').scrollTop = $('#chatArea').scrollHeight;
}
function startConversation() { state.current = []; state.activeId = null; renderMessages(); renderConversations(); input.focus(); saveState(); }
function loadConversation(id) { const found = state.conversations.find(item => item.id === id); if (!found) return; state.activeId = id; state.current = found.messages; renderMessages(); renderConversations(); }
function addConversation() {
  const title = state.current.find(message => message.role === 'user')?.content || 'New conversation';
  const existing = state.conversations.find(item => item.id === state.activeId);
  if (existing) { existing.title = title; existing.messages = state.current; }
  else { state.activeId = crypto.randomUUID(); state.conversations.unshift({ id: state.activeId, title, messages: state.current }); }
  renderConversations(); saveState();
}
function setTheme(theme) { const value = theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme; document.documentElement.dataset.theme = value; localStorage.setItem('jarvis-theme', theme); $('#appearanceSelect').value = theme; $('#themeToggle').innerHTML = value === 'dark' ? '&#9788;' : '&#9789;'; }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function openModal(modal) { $('#modalBackdrop').hidden = false; modal.hidden = false; }
function closeModals() { $('#modalBackdrop').hidden = true; document.querySelectorAll('.modal').forEach(modal => { modal.hidden = true; }); }

$('#chatForm').addEventListener('submit', async event => {
  event.preventDefault(); const message = input.value.trim(); if (!message || thinking.hidden === false) return;
  state.current.push({ role: 'user', content: message }); input.value = ''; input.style.height = 'auto'; renderMessages(); addConversation(); thinking.hidden = false; $('#chatArea').scrollTop = $('#chatArea').scrollHeight;
  try {
    const response = await fetch('/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: 'Harshey_001', message }) });
    const data = await response.json(); if (!response.ok) throw new Error(data.detail || 'The intelligence core returned an error.');
    state.current.push({ role: 'assistant', content: data.response }); addConversation(); renderMessages();
  } catch (error) { state.current.push({ role: 'assistant', content: `Connection interrupted: ${error.message}` }); addConversation(); renderMessages(); showToast('Could not reach the intelligence core'); }
  finally { thinking.hidden = true; }
});
input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 120)}px`; });
input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); $('#chatForm').requestSubmit(); } });
document.querySelectorAll('.prompt-card').forEach(button => button.addEventListener('click', () => { input.value = button.dataset.prompt; input.focus(); $('#chatForm').requestSubmit(); }));
$('#newChat').addEventListener('click', startConversation);
$('#chatSearch').addEventListener('input', event => renderConversations(event.target.value));
$('#openSidebar').addEventListener('click', () => $('#appShell').classList.add('sidebar-open'));
$('#closeSidebar').addEventListener('click', () => $('#appShell').classList.remove('sidebar-open'));
$('#themeToggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#openSettings').addEventListener('click', () => openModal($('#settingsModal')));
$('#openProfile').addEventListener('click', () => { $('#profileName').value = state.profile.name; $('#profileNote').value = state.profile.note; $('#profileAvatar').textContent = initials(state.profile.name); openModal($('#profileModal')); });
$('#saveProfile').addEventListener('click', () => { state.profile.name = $('#profileName').value.trim() || 'Harshey Golar'; state.profile.note = $('#profileNote').value.trim() || 'Personal workspace'; $('#sidebarName').textContent = state.profile.name; $('#sidebarAvatar').textContent = initials(state.profile.name); closeModals(); saveState(); renderMessages(); showToast('Profile updated'); });
document.querySelectorAll('.close-modal').forEach(button => button.addEventListener('click', closeModals));
$('#modalBackdrop').addEventListener('click', event => { if (event.target === $('#modalBackdrop')) closeModals(); });
$('#appearanceSelect').addEventListener('change', event => setTheme(event.target.value));
$('#rememberToggle').checked = state.remember;
$('#rememberToggle').addEventListener('change', event => { state.remember = event.target.checked; saveState(); showToast(state.remember ? 'Conversations will be remembered' : 'Conversation memory paused'); });
$('#modelPicker').addEventListener('click', () => { const menu = $('#modelMenu'); menu.hidden = !menu.hidden; $('#modelPicker').setAttribute('aria-expanded', String(!menu.hidden)); });
document.querySelectorAll('#modelMenu button').forEach(button => button.addEventListener('click', () => { $('#activeModel').textContent = button.dataset.model; $('#modelMenu').hidden = true; document.querySelectorAll('#modelMenu .check').forEach(check => check.textContent = ''); button.querySelector('.check').textContent = '✓'; showToast(`${button.dataset.model} selected`); }));
document.addEventListener('click', event => { if (!event.target.closest('.model-picker-wrap')) $('#modelMenu').hidden = true; });

$('#sidebarName').textContent = state.profile.name; $('#sidebarAvatar').textContent = initials(state.profile.name); setTheme(localStorage.getItem('jarvis-theme') || 'system'); renderMessages(); renderConversations();
