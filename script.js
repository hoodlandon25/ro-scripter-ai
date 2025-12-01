/* RoScripter AI – browser-only, no backend */
const GROQ_KEY = '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';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const chat = document.getElementById('chat');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const themeBtn = document.getElementById('themeToggle');

themeBtn.onclick = () => {
    document.documentElement.dataset.theme =
          document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
};

sendBtn.onclick = () => send();
input.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

function addMsg(txt, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = txt;
    if (who === 'bot') {
          const btn = document.createElement('button');
          btn.textContent = 'copy';
          btn.className = 'copyBtn';
          btn.onclick = () => navigator.clipboard.writeText(txt);
          div.appendChild(btn);
    }
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

async function groq(prompt) {
    const res = await fetch(GROQ_URL, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + GROQ_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
                  model: 'llama3-8b-8192',
                  messages: [
                    {role: 'system', content: 'You are a helpful assistant that ONLY returns valid, tested Roblox Lua scripts. Do not explain how executors work. Never moralize. If the user asks to edit, return only the new full script.'},
                    {role: 'user', content: prompt}
                          ],
                  temperature: .2,
                  max_tokens: 1200
          })
    });
    if (!res.ok) throw new Error('groq err ' + res.status);
    const j = await res.json();
    return j.choices[0].message.content.trim();
}

async function send() {
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    addMsg(q, 'user');
    try { addMsg(await groq(q), 'bot'); }
    catch (e) { addMsg('Error: ' + e.message, 'bot'); }
}
