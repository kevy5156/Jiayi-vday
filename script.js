// ====== CONFIG (edit these lines only) ======
const config = {
  valentineName: "Jiayi",
  pageTitle: "Will You Be My Valentine? 💝",

  floatingEmojis: {
    hearts: ['❤️', '💖', '💝', '💗', '💓'],
    bears: ['🧸', '🐻']
  },

  questions: {
    first: {
      text: "Do you like me?",
      yesBtn: "Yes",
      noBtn: "No",
      secretAnswer: "I don't like you, I love you! ❤️"
    },
    second: {
      text: "How much do you love me?",
      startText: "This much!",
      nextBtn: "Next ❤️"
    },
    third: {
      text: "Will you be my Valentine for February 14th 2026?",
      yesBtn: "Yes!",
      noBtn: "No"
    }
  },

  loveMessages: {
    extreme: "WOOOOW You love me that much?? 🥰🚀💝",
    high: "To infinity and beyond! 🚀💝",
    normal: "And beyond! 🥰",
    low: "Aww that's still cute 😌"
  },

  celebration: {
    title: "Yay! I'm the luckiest person...",
    message: "Now come get your gift get some bite lol",
    emojis: "🎁💖🤗💝💋❤️💕"
  },

  colors: {
    backgroundStart: "#ffafbd",
    backgroundEnd: "#ffc3a0",
    buttonBackground: "#ff6b6b",
    buttonHover: "#ff8787",
    textColor: "#ff4757"
  },

  animations: {
    floatDistancePx: 50 // sideways drift
  }
};

// ====== APPLY THEME ======
document.title = config.pageTitle;
document.documentElement.style.setProperty('--bg1', config.colors.backgroundStart);
document.documentElement.style.setProperty('--bg2', config.colors.backgroundEnd);
document.documentElement.style.setProperty('--btn', config.colors.buttonBackground);
document.documentElement.style.setProperty('--btnHover', config.colors.buttonHover);
document.documentElement.style.setProperty('--text', config.colors.textColor);

// ====== DOM ======
const titleEl = document.getElementById('title');
const subtitleEl = document.getElementById('subtitle');
const buttonsEl = document.getElementById('buttons');

const loveMeterEl = document.getElementById('loveMeter');
const meterLabel = document.getElementById('meterLabel');
const meterPct = document.getElementById('meterPct');
const meter = document.getElementById('meter');
const meterMsg = document.getElementById('meterMsg');
const nextBtn = document.getElementById('nextBtn');

const celebrationEl = document.getElementById('celebration');
const celebrateTitle = document.getElementById('celebrateTitle');
const celebrateMsg = document.getElementById('celebrateMsg');
const celebrateEmojis = document.getElementById('celebrateEmojis');
const restartBtn = document.getElementById('restartBtn');

const floatLayer = document.getElementById('floatLayer');

let step = 1; // 1 first Q, 2 meter, 3 final Q, 4 celebration
let noWiggleTimer = null;

// ====== FLOATING EMOJIS ======
function spawnFloaties() {
  const pool = [...config.floatingEmojis.hearts, ...config.floatingEmojis.bears];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('div');
    s.className = 'floaty';
    s.textContent = pool[Math.floor(Math.random() * pool.length)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.setProperty('--dur', (10 + Math.random() * 10) + 's');

    const dx = (Math.random() * 2 - 1) * config.animations.floatDistancePx;
    s.style.setProperty('--dx', dx + 'px');
    s.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);

    floatLayer.appendChild(s);
  }
}
spawnFloaties();

// ====== UI HELPERS ======
function clearButtons() { buttonsEl.innerHTML = ''; }

function makeBtn(label, cls, onClick) {
  const b = document.createElement('button');
  b.className = `btn ${cls}`;
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

function setQuestion(text) {
  titleEl.textContent = `${config.valentineName} 💝`;
  subtitleEl.textContent = text;
}

function showLoveMeter() {
  loveMeterEl.classList.remove('hidden');
  clearButtons();

  meterLabel.textContent = config.questions.second.startText;
  nextBtn.textContent = config.questions.second.nextBtn;

  updateMeterText();
}

function hideLoveMeter() {
  loveMeterEl.classList.add('hidden');
}

function updateMeterText() {
  const v = Number(meter.value);
  meterPct.textContent = `${v}%`;

  if (v > 5000) meterMsg.textContent = config.loveMessages.extreme;
  else if (v > 1000) meterMsg.textContent = config.loveMessages.high;
  else if (v > 100) meterMsg.textContent = config.loveMessages.normal;
  else meterMsg.textContent = config.loveMessages.low;
}

// playful but still clickable
function makePlayfulNoButton(label, onClick) {
  const b = makeBtn(label, 'ghost', onClick);
  b.classList.add('wiggle');

  b.addEventListener('mousemove', () => {
    const nudgeX = (Math.random() * 2 - 1) * 10;
    const nudgeY = (Math.random() * 2 - 1) * 8;
    b.style.transform = `translate(${nudgeX}px, ${nudgeY}px)`;
    clearTimeout(noWiggleTimer);
    noWiggleTimer = setTimeout(() => (b.style.transform = ''), 250);
  });

  return b;
}

// ====== RENDER STEPS ======
function renderStep1() {
  step = 1;
  hideLoveMeter();
  celebrationEl.classList.add('hidden');

  setQuestion(config.questions.first.text);
  clearButtons();

  const yes = makeBtn(config.questions.first.yesBtn, 'primary', () => {
    subtitleEl.textContent = config.questions.first.secretAnswer;
    setTimeout(renderStep2, 900);
  });

  const no = makePlayfulNoButton(config.questions.first.noBtn, () => {
    subtitleEl.textContent = "Thanks for being honest 💛";
    setTimeout(renderStep2, 900);
  });

  buttonsEl.appendChild(yes);
  buttonsEl.appendChild(no);
}

function renderStep2() {
  step = 2;
  setQuestion(config.questions.second.text);
  showLoveMeter();
}

function renderStep3() {
  step = 3;
  hideLoveMeter();
  setQuestion(config.questions.third.text);
  clearButtons();

  const yes = makeBtn(config.questions.third.yesBtn, 'primary', () => {
    renderCelebration();
  });

  const no = makePlayfulNoButton(config.questions.third.noBtn, () => {
    subtitleEl.textContent = "No worries 💛 Thanks for reading this!";
  });

  buttonsEl.appendChild(yes);
  buttonsEl.appendChild(no);
}

function renderCelebration() {
  step = 4;
  hideLoveMeter();
  clearButtons();
  subtitleEl.textContent = "";

  celebrationEl.classList.remove('hidden');
  celebrateTitle.textContent = config.celebration.title;
  celebrateMsg.textContent = config.celebration.message;
  celebrateEmojis.textContent = config.celebration.emojis;
}

function restart() {
  meter.value = 100;
  updateMeterText();
  renderStep1();
}

// ====== EVENTS ======
meter.addEventListener('input', updateMeterText);
nextBtn.addEventListener('click', renderStep3);
restartBtn.addEventListener('click', restart);

// start
renderStep1();
