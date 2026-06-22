'use strict';

let noAttempts = 0;
let noPlaced   = false;
const funnyMsgs = [
  'Are you sure? 🥺','Think again 😭','Please? ❤️',
  "You can't escape this love 😘",'Just click Yes 😍',
  'My heart is breaking 💔','Nope, not an option 😤','Come on… 🙈',
];

const heartEmojis = ['❤️','💕','💖','💗','💓','💞','🌸','✨'];

function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

/* ---- Background hearts ---- */
function spawnBgHeart() {
  const el = document.createElement('span');
  el.className   = 'bg-heart';
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  el.style.left  = rand(0, 100) + 'vw';
  el.style.fontSize = rand(0.9, 2.2) + 'rem';
  const dur = rand(6, 14);
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = rand(0, dur * 0.8) + 's';
  document.getElementById('hearts-bg').appendChild(el);
  el.addEventListener('animationiteration', () => { el.style.left = rand(0, 100) + 'vw'; });
}
for (let i = 0; i < 28; i++) spawnBgHeart();

/* ---- No button escape ---- */
const btnNo = document.getElementById('btn-no');

function placeNoButton() {
  if (noPlaced) return;
  const yesRect = document.getElementById('btn-yes').getBoundingClientRect();
  btnNo.style.top  = yesRect.top  + 'px';
  btnNo.style.left = (yesRect.right + 16) + 'px';
  noPlaced = true;
}

function escapeNo(e) {
  if (e) e.preventDefault();
  noAttempts++;
  const bw = btnNo.offsetWidth || 100, bh = btnNo.offsetHeight || 44, m = 16;
  const maxX = window.innerWidth - bw - m, maxY = window.innerHeight - bh - m;
  const cx = e?.clientX ?? e?.touches?.[0]?.clientX ?? window.innerWidth / 2;
  const cy = e?.clientY ?? e?.touches?.[0]?.clientY ?? window.innerHeight / 2;
  let newX, newY, tries = 0;
  do {
    newX = rand(m, maxX); newY = rand(m, maxY); tries++;
  } while (tries < 20 && Math.abs(newX - cx) < 140 && Math.abs(newY - cy) < 100);
  btnNo.style.left = clamp(newX, m, maxX) + 'px';
  btnNo.style.top  = clamp(newY, m, maxY) + 'px';
  if (noAttempts % 2 === 0) {
    const msgEl = document.getElementById('funny-msg');
    msgEl.textContent = funnyMsgs[Math.floor(Math.random() * funnyMsgs.length)];
    msgEl.style.animation = 'none'; void msgEl.offsetWidth; msgEl.style.animation = '';
  }
}

window.addEventListener('load', () => setTimeout(placeNoButton, 400));

/* ---- Yes button ---- */
function handleYes() {
  burstHearts();
  setTimeout(() => transitionTo('page-date'), 1100);
}

function burstHearts() {
  const rect = document.getElementById('btn-yes').getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('span');
    el.className   = 'burst-heart';
    el.textContent = heartEmojis[Math.floor(Math.random() * 5)];
    el.style.left  = cx + 'px'; el.style.top = cy + 'px';
    const angle = rand(0, 360), dist = rand(80, 220);
    el.style.setProperty('--tx', Math.cos(angle * Math.PI / 180) * dist + 'px');
    el.style.setProperty('--ty', Math.sin(angle * Math.PI / 180) * dist + 'px');
    el.style.animationDelay = rand(0, 0.3) + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

/* ---- Date confirmation ---- */
function confirmDate() {
  const picker = document.getElementById('date-picker');
  if (!picker.value) { picker.style.borderColor = '#e91e8c'; picker.focus(); return; }
  const dateStr = new Date(picker.value + 'T12:00:00').toLocaleDateString('en-US', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });
  document.getElementById('chosen-date-display').textContent = '📅 ' + dateStr;
  launchConfetti();
  transitionTo('page-celebrate');
}

/* ---- Page transitions ---- */
function transitionTo(targetId) {
  const current = document.querySelector('.page.active');
  const target  = document.getElementById(targetId);
  if (!current || !target || current === target) return;
  current.classList.add('exit');
  setTimeout(() => { current.classList.remove('active','exit'); target.classList.add('active'); }, 500);
}

/* ---- Confetti ---- */
const confettiColors = ['#ff6fa8','#e91e8c','#ff4081','#f48fb1','#ce93d8','#ffb3d1','#fff176','#80deea'];

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  for (let i = 0; i < 160; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left   = rand(0, 100) + 'vw';
    el.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    el.style.width  = rand(7, 13) + 'px'; el.style.height = rand(7, 13) + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.animationDuration = rand(2.5, 5) + 's';
    el.style.animationDelay    = rand(0, 2) + 's';
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('span');
    el.className   = 'bg-heart';
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    el.style.left  = rand(0, 100) + 'vw';
    el.style.fontSize = rand(1.2, 2.8) + 'rem';
    const dur = rand(4, 9);
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = rand(0, 3) + 's';
    document.getElementById('hearts-bg').appendChild(el);
  }
}
