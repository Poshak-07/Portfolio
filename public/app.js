document.documentElement.classList.remove('no-js');
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 800px)');
let toastTimer;
function announce(message) {
  const toast = $('#announcement');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

// An accessible disclosure menu: links remain native, Escape restores focus.
const menu = $('.menu-toggle');
const navigation = $('#main-nav');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (menu.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') { setMenu(false); menu.focus(); }
  if (event.key === 'Tab') {
    const links = $$('a', navigation);
    if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); menu.focus(); }
    else if (event.shiftKey && document.activeElement === menu) { event.preventDefault(); links.at(-1).focus(); }
  }
});
mobile.addEventListener('change', () => setMenu(false));

// Static HTML holds every case study. Filtering is progressive enhancement.
function filterProjects(filter) {
  const rows = $$('.project-row');
  let visible = 0;
  rows.forEach(row => {
    row.hidden = filter !== 'all' && row.dataset.category !== filter;
    if (!row.hidden) visible++;
  });
  $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  const count = $('#filter-count');
  if (count) count.textContent = `${String(visible).padStart(2, '0')} ${visible === 1 ? 'PROJECT' : 'PROJECTS'}`;
}
$$('[data-filter]').forEach(button => button.addEventListener('click', () => { filterProjects(button.dataset.filter); clickSound(); }));
$$('.project-jump a').forEach(link => link.addEventListener('click', () => filterProjects('all')));

$$('.copy-email').forEach(button => button.addEventListener('click', async () => {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(button.dataset.email);
    else {
      const area = document.createElement('textarea');
      area.value = button.dataset.email;
      area.style.cssText = 'position:fixed;left:-9999px';
      document.body.append(area); area.select();
      const copied = document.execCommand('copy'); area.remove(); button.focus();
      if (!copied) throw new Error('Copy unavailable');
    }
    announce('Email copied. Let’s make something useful.');
  } catch { announce('Copy unavailable. Select annamposhak@gmail.com or use the email link.'); }
}));

// Audio is generated locally. Every page starts silent; no saved choice autoplays.
let audio, soundEnabled = false, ambient;
const sound = $('.sound-toggle');
try { if (localStorage.getItem('portfolio-sound') === 'on') sound.title = 'Sound was previously enabled. Click to enable it for this visit.'; } catch { /* Storage is optional. */ }
sound.addEventListener('click', async () => {
  sound.disabled = true;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (!soundEnabled) {
      await audio.resume();
      if (!ambient) {
        const gain = audio.createGain(); gain.gain.value = .012; gain.connect(audio.destination);
        const a = audio.createOscillator(), b = audio.createOscillator();
        a.frequency.value = 110; b.frequency.value = 164.81;
        a.type = 'sine'; b.type = 'sine'; a.connect(gain); b.connect(gain); a.start(); b.start();
        ambient = { a, b, gain };
      }
      soundEnabled = true;
    } else { await audio.suspend(); soundEnabled = false; }
    sound.setAttribute('aria-pressed', String(soundEnabled));
    sound.innerHTML = `<span aria-hidden="true">◖</span> Sound ${soundEnabled ? 'on' : 'off'}`;
    try { localStorage.setItem('portfolio-sound', soundEnabled ? 'on' : 'off'); } catch { /* Optional. */ }
  } catch { announce('Sound is unavailable in this browser.'); }
  finally { sound.disabled = false; }
});
function clickSound() {
  if (!soundEnabled || !audio || audio.state !== 'running') return;
  const osc = audio.createOscillator(), gain = audio.createGain();
  osc.frequency.value = 440; gain.gain.setValueAtTime(.02, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .07);
  osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + .08);
}
document.addEventListener('visibilitychange', () => {
  if (!audio || !soundEnabled) return;
  (document.hidden ? audio.suspend() : audio.resume()).catch(() => {});
});

const chapterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('just-visible');
      chapterObserver.unobserve(entry.target);
    }
  });
}, { threshold: .15 });
$$('.chapter-label, .metric').forEach(el => {
  if (!reduced.matches && el.classList.contains('chapter-label')) el.classList.add('reveal-pending');
  chapterObserver.observe(el);
});

$$('.magnetic').forEach(button => {
  button.addEventListener('pointermove', event => {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    const rect = button.getBoundingClientRect();
    button.style.translate = `${(event.clientX - rect.left - rect.width / 2) * .05}px ${(event.clientY - rect.top - rect.height / 2) * .09}px`;
  });
  button.addEventListener('pointerleave', () => button.style.translate = '0 0');
});

// Deterministic geometry, not real observations. Render only on scroll/resize,
// only while visible; capped DPR and no perpetual requestAnimationFrame loop.
const canvas = $('#data-canvas');
const hero = $('.hero');
let ctx, cw = 0, ch = 0, canvasVisible = true;
const pointCount = 1150;
const points = Array.from({ length: pointCount }, (_, i) => {
  const z = 1 - 2 * (i + .5) / pointCount;
  const angle = i * 2.399963229728653;
  const r = Math.sqrt(1 - z * z);
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r, z, i };
});
function configureCanvas() {
  if (!canvas) return;
  const enabled = !mobile.matches && !reduced.matches;
  canvas.parentElement.classList.toggle('canvas-ready', enabled);
  if (!enabled) { ctx = null; return; }
  ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) { canvas.parentElement.classList.remove('canvas-ready'); return; }
  const rect = canvas.getBoundingClientRect();
  cw = canvas.clientWidth; ch = canvas.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawHero();
}
function drawHero() {
  if (!ctx || !canvasVisible || document.hidden) return;
  const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight - innerHeight)));
  const centerX = cw * .48, centerY = ch * .46, radius = Math.min(cw * .32, ch * .40);
  ctx.clearRect(0, 0, cw, ch);
  const glow = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, radius * 1.4);
  glow.addColorStop(0, '#a9773718'); glow.addColorStop(1, '#a9773700');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, cw, ch);
  const stage = Math.min(3, Math.floor(progress * 4));
  const label = $('#scene-label');
  label.textContent = ['01 / THE SOURCE', '02 / CONNECTED RECORDS', '03 / STRUCTURED INSIGHT', '04 / A CRICKET UNIVERSE'][stage];
  const angle = progress * 1.9;
  const spread = .12 + .88 * Math.min(1, progress * 4 + .65);
  ctx.strokeStyle = '#d8ad7033'; ctx.lineWidth = .7;
  for (let ring = 0; ring < 3; ring++) {
    ctx.beginPath(); ctx.ellipse(centerX, centerY, radius * (1.15 + ring * .14), radius * .27, -.3 + ring * .35 + progress * .4, 0, Math.PI * 2); ctx.stroke();
  }
  let previous;
  for (const p of points) {
    const x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
    const depth = p.x * Math.sin(angle) + p.y * Math.cos(angle);
    let px = centerX + x * radius * spread, py = centerY + p.z * radius * .78 * spread + depth * radius * .16;
    // Mid-scroll, the record cloud briefly takes the form of ordered columns.
    const structured = Math.max(0, 1 - Math.abs(progress - .62) / .2) * .65;
    px = px * (1 - structured) + (centerX + ((p.i % 38) - 19) * radius / 20) * structured;
    py = py * (1 - structured) + (centerY + (Math.floor(p.i / 38) - 15) * radius / 18) * structured;
    const opacity = .15 + (depth + 1) * .32;
    ctx.fillStyle = p.i % 13 === 0 ? `rgba(246,228,196,${opacity})` : `rgba(216,173,112,${opacity})`;
    ctx.beginPath(); ctx.arc(px, py, depth > 0 ? 1.5 : .75, 0, Math.PI * 2); ctx.fill();
    if (previous && p.i % 24 === 0 && progress > .18) {
      ctx.strokeStyle = '#d8ad7014'; ctx.beginPath(); ctx.moveTo(previous[0], previous[1]); ctx.lineTo(px, py); ctx.stroke();
    }
    previous = [px, py];
  }
  ctx.fillStyle = '#f1d3a5'; ctx.shadowColor = '#d8ad70'; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.arc(centerX + Math.cos(progress * 4) * radius * 1.2, centerY + Math.sin(progress * 4) * radius * .27, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
}
if (hero) new IntersectionObserver(entries => { canvasVisible = entries[0].isIntersecting; if (canvasVisible) scheduleFrame(); }).observe(hero);
const progressBar = $('.scroll-progress span');
const sections = $$('main > section[id]');
let framePending = false;
function updateFrame() {
  framePending = false;
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.transform = `scaleX(${scrollable > 0 ? Math.min(1, scrollY / scrollable) : 0})`;
  drawHero();
  let current = sections[0]?.id;
  sections.forEach(section => { if (section.getBoundingClientRect().top <= innerHeight * .4) current = section.id; });
  $$('#main-nav a[href^="#"]').forEach(link => {
    if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (!reduced.matches && !mobile.matches) {
    $$('.project-art').forEach(art => {
      const rect = art.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) {
        const media = art.querySelector('svg, .website-stage');
        if (media) media.style.translate = `0 ${Math.max(-5, Math.min(5, (rect.top - innerHeight / 2) * .008))}px`;
      }
    });
  }
}
function scheduleFrame() { if (!framePending) { framePending = true; requestAnimationFrame(updateFrame); } }
addEventListener('scroll', scheduleFrame, { passive: true });
addEventListener('resize', () => { configureCanvas(); scheduleFrame(); }, { passive: true });
reduced.addEventListener('change', () => {
  configureCanvas();
  if (reduced.matches) { $$('.project-art svg, .website-stage, .magnetic').forEach(el => el.style.translate = '0 0'); $$('.reveal-pending').forEach(el => el.classList.remove('reveal-pending')); }
});
configureCanvas(); scheduleFrame();
