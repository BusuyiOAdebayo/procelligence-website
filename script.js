const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.site-nav');menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});document.querySelectorAll('.site-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));document.getElementById('year').textContent=new Date().getFullYear();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Procelligence AI website assistant
(() => {
  const launcher = document.getElementById('chatLauncher');
  const widget = document.getElementById('chatWidget');
  const closeButton = document.getElementById('chatClose');
  const clearButton = document.getElementById('chatClear');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendButton = document.getElementById('chatSend');
  const messagesEl = document.getElementById('chatMessages');
  const suggestions = document.getElementById('chatSuggestions');

  if (!launcher || !widget || !form) return;

  let history = [];
  let busy = false;

  const setOpen = (open) => {
    widget.classList.toggle('open', open);
    launcher.classList.toggle('hidden', open);
    widget.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    if (open) setTimeout(() => input.focus(), 120);
  };

  const scrollToBottom = () => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const addMessage = (role, text, options = {}) => {
    const row = document.createElement('div');
    row.className = `chat-message ${role}${options.error ? ' error' : ''}`;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    scrollToBottom();
    return row;
  };

  const addTyping = () => {
    const row = document.createElement('div');
    row.className = 'chat-message assistant';
    row.id = 'chatTyping';
    row.innerHTML = '<div class="message-bubble"><span class="chat-typing"><span></span><span></span><span></span></span></div>';
    messagesEl.appendChild(row);
    scrollToBottom();
    return row;
  };

  const resetChat = () => {
    history = [];
    messagesEl.innerHTML = `
      <div class="chat-message assistant">
        <div class="message-bubble"><strong>Welcome to Procelligence AI.</strong><p>I can explain our Agentic AI platform, the ReActOR framework, capabilities, and application domains.</p></div>
      </div>
      <div class="chat-suggestions" id="chatSuggestions">
        <button type="button">What is the ReActOR framework?</button>
        <button type="button">How can agents use scientific tools?</button>
        <button type="button">Where can the platform be applied?</button>
      </div>`;
    bindSuggestions();
  };

  const submitMessage = async (text) => {
    const clean = text.trim();
    if (!clean || busy) return;

    busy = true;
    sendButton.disabled = true;
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('chatSuggestions')?.remove();
    addMessage('user', clean);
    history.push({ role: 'user', content: clean });
    const typing = addTyping();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-10) })
      });

      const data = await response.json().catch(() => ({}));
      typing.remove();

      if (!response.ok) {
        throw new Error(data.error || 'The assistant is temporarily unavailable.');
      }

      const reply = String(data.reply || '').trim();
      if (!reply) throw new Error('The assistant returned an empty response.');
      addMessage('assistant', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (error) {
      typing.remove();
      const localHint = location.protocol === 'file:'
        ? ' The AI connection works after deployment to Vercel with OPENAI_API_KEY configured.'
        : '';
      addMessage('assistant', `${error.message}${localHint}`, { error: true });
    } finally {
      busy = false;
      sendButton.disabled = false;
      input.focus();
    }
  };

  const bindSuggestions = () => {
    document.querySelectorAll('#chatSuggestions button').forEach(button => {
      button.addEventListener('click', () => submitMessage(button.textContent));
    });
  };

  launcher.addEventListener('click', () => setOpen(true));
  closeButton.addEventListener('click', () => setOpen(false));
  clearButton.addEventListener('click', resetChat);
  form.addEventListener('submit', event => {
    event.preventDefault();
    submitMessage(input.value);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && widget.classList.contains('open')) setOpen(false);
  });

  bindSuggestions();
})();
