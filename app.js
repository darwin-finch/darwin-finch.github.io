/* ═══════════════════════════════════════════════════════
   FINCH WEBSITE — JavaScript
   Terminal animation · Copy button · Nav toggle
═══════════════════════════════════════════════════════ */

// ── Mobile nav toggle ────────────────────────────────
function toggleNav() {
  document.getElementById('nav-links').classList.toggle('open');
}

// Close nav when a link is clicked
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('nav-links').classList.remove('open');
    });
  });
});

// ── Copy install command ─────────────────────────────
function copyInstall() {
  const text = document.getElementById('install-text').textContent;
  const btn  = document.getElementById('copy-btn');

  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'COPIED!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'COPY';
      btn.classList.remove('copied');
    }, 2200);
  }).catch(() => {
    // Fallback for browsers without clipboard API
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = 'COPIED!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'COPY';
      btn.classList.remove('copied');
    }, 2200);
  });
}

// ── Terminal animation ───────────────────────────────
//
// Each entry in DEMO is one "event":
//   type: 'nl'     — append a blank line
//   type: 'raw'    — append a line instantly (no typing animation)
//   type: 'type'   — type the text character by character
//   type: 'stream' — print lines one at a time (simulated token stream)
//
// delay is the pause BEFORE the event (ms)
// speed is the per-character delay for 'type' events (ms)

const DEMO = [
  { type: 'raw',    text: '$ finch',                                       cls: 'cmd',      delay: 600 },
  { type: 'nl',                                                                              delay: 150 },
  { type: 'raw',    text: '      \u2584\u2584\u2584\u2584\u2584\u2584',     cls: 'bird',     delay: 80 },
  { type: 'raw',    text: '    \u2597\u259f\u2588\u25cf\u2588\u2588\u2599\u25ba  finch v0.5.2', cls: 'bird', delay: 40 },
  { type: 'raw',    text: '  \u258c\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u258c  Qwen-2.5-7B \u00b7 Metal \u00b7 ready', cls: 'bird', delay: 40 },
  { type: 'raw',    text: '  \u259d\u259c\u2588\u2588\u2588\u2588\u2588\u2588\u259b\u2598  ~/repos/myproject',                    cls: 'bird', delay: 40 },
  { type: 'raw',    text: '     \u2565  \u2565',                            cls: 'bird',     delay: 40 },
  { type: 'raw',    text: '    \u2572    \u2571',                           cls: 'bird',     delay: 200 },
  { type: 'nl',                                                                              delay: 300 },
  { type: 'type',   text: '> How do I handle errors in async Rust?',        cls: 'cmd',      delay: 700, speed: 32 },
  { type: 'nl',                                                                              delay: 350 },
  { type: 'stream', lines: [
    '  Use `?` with `anyhow::Result` for clean error propagation:',
    '',
    '    async fn fetch_user(id: u64) -> anyhow::Result<User> {',
    '        let resp = client.get(url).await?;',
    '        let user = resp.json::<User>().await?;',
    '        Ok(user)',
    '    }',
    '',
    '  anyhow handles From<> conversions automatically — no more',
    '  manual error type juggling. Add context with `.context()`:',
    '',
    '    .with_context(|| format!("fetching user {id}"))?',
  ],                                                                         cls: 'response', delay: 80 },
  { type: 'nl',                                                                              delay: 400 },
  { type: 'raw',    text: '> ',                                             cls: 'cmd',      delay: 0 },
];

// ── Renderer ─────────────────────────────────────────
let demoIndex = 0;
const outEl = document.getElementById('term-out');

function appendLine(text, cls) {
  const el = document.createElement('span');
  el.className = 'line' + (cls ? ' ' + cls : '');
  el.textContent = text;
  outEl.appendChild(el);
  outEl.appendChild(document.createTextNode('\n'));
}

function typeText(text, cls, speed, onDone) {
  const el = document.createElement('span');
  el.className = 'line' + (cls ? ' ' + cls : '');
  outEl.appendChild(el);
  outEl.appendChild(document.createTextNode('\n'));

  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(iv);
      if (onDone) onDone();
    }
  }, speed || 30);
}

function streamLines(lines, cls, lineDelay, onDone) {
  let i = 0;
  function next() {
    if (i >= lines.length) { if (onDone) onDone(); return; }
    appendLine(lines[i++], cls);
    setTimeout(next, lineDelay);
  }
  next();
}

function runDemo() {
  if (demoIndex >= DEMO.length) return;
  const ev = DEMO[demoIndex++];

  setTimeout(() => {
    switch (ev.type) {
      case 'nl':
        outEl.appendChild(document.createTextNode('\n'));
        runDemo();
        break;

      case 'raw':
        appendLine(ev.text, ev.cls);
        runDemo();
        break;

      case 'type':
        typeText(ev.text, ev.cls, ev.speed, runDemo);
        break;

      case 'stream':
        streamLines(ev.lines, ev.cls, 70, runDemo);
        break;
    }
  }, ev.delay || 0);
}

// Start after a short pause
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(runDemo, 900);
});

// ── Intersection Observer — animate cards on scroll ──
if ('IntersectionObserver' in window) {
  const cards = document.querySelectorAll('.card, .contrib-card, .step');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(12px)';
    c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    io.observe(c);
  });
}
