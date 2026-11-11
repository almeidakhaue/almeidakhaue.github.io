/* CONFIGURAÇÃO: altere somente o nome de usuário para conectar o site ao seu GitHub. */
const SITE_CONFIG = {
  githubUsername: '', // exemplo: 'seuusuario' (sem @)
};

const githubURL = SITE_CONFIG.githubUsername
  ? `https://github.com/${encodeURIComponent(SITE_CONFIG.githubUsername)}`
  : 'https://github.com/';
document.querySelectorAll('[data-github]').forEach(link => link.href = githubURL);

const clock = document.querySelector('#live-clock');
const updateClock = () => {
  clock.textContent = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit',
    second: '2-digit', hour12: false
  }).format(new Date()) + ' BRT';
};
updateClock();
setInterval(updateClock, 1000);
document.querySelector('#year').textContent = new Date().getFullYear();

const themeToggle = document.querySelector('.theme-toggle');
let alternate = false;
function applyTheme() {
  document.body.classList.toggle('alternate', alternate);
  themeToggle.setAttribute('aria-pressed', String(alternate));
  themeToggle.querySelector('.theme-label').textContent = alternate ? 'UNIVERSO ORIGINAL' : 'OUTRO UNIVERSO';
}
themeToggle.addEventListener('click', () => { alternate = !alternate; applyTheme(); });
document.querySelector('.remix-button').addEventListener('click', () => {
  alternate = !alternate; applyTheme();
  document.querySelector('.hero').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => { card.hidden = filter !== 'all' && !card.dataset.categories.split(' ').includes(filter); });
}));

const terminalScreen = document.querySelector('#terminal-output');
const terminalForm = document.querySelector('#terminal-form');
const terminalInput = document.querySelector('#terminal-input');
const commandReplies = {
  help: 'COMANDOS DISPONÍVEIS: help, about, work, skills, coffee, secret, clear, github, theme',
  about: 'Estudante de Sistemas de Informação. Interessado em IA, dados, design, UX e boas perguntas.',
  work: 'Projetos: skincare contextual e direção criativa de photo dumps com IA. Confira a seção PROJETOS.',
  skills: 'Transmissão ativa: Python, SQL, Machine Learning, análise de dados, UX/UI e prototipação.',
  coffee: '☕ Erro 418: sou um bule. Mas você pode trazer café mesmo assim.',
  secret: '✳ EASTER EGG ENCONTRADO. A estética é uma interface. A curiosidade é o sistema operacional.',
  github: 'Abrindo o GitHub em uma nova aba...'
};
function terminalLine(content, type = 'answer') {
  const p = document.createElement('p');
  if (type === 'echo') p.className = 'terminal-echo';
  p.textContent = content;
  terminalScreen.appendChild(p);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
}
function executeCommand(raw) {
  const value = raw.trim();
  if (!value) return;
  terminalLine(`visitor@archive:~$ ${value}`, 'echo');
  const cmd = value.toLowerCase();
  if (cmd === 'clear') { terminalScreen.replaceChildren(); return; }
  if (cmd === 'theme') {
    alternate = !alternate; applyTheme();
    terminalLine('Universo remixado com sucesso.');
    return;
  }
  if (cmd === 'github') {
    terminalLine(commandReplies.github);
    window.open(githubURL, '_blank', 'noopener,noreferrer');
    return;
  }
  terminalLine(commandReplies[cmd] || `Comando não encontrado: ${value}. Tente 'help'.`);
}
terminalForm.addEventListener('submit', event => {
  event.preventDefault();
  executeCommand(terminalInput.value);
  terminalInput.value = '';
  terminalInput.focus();
});
document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => {
  executeCommand(button.dataset.command);
  terminalInput.focus();
}));
document.addEventListener('keydown', event => {
  if (event.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    terminalInput.focus();
  }
});
