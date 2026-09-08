/* ═══════════════════════════════════════════════════════
   FINCH WEBSITE — JavaScript
   Terminal animation · Copy button · Nav toggle
═══════════════════════════════════════════════════════ */

// ── Mobile nav toggle ────────────────────────────────
function toggleNav() {
  const links = document.getElementById('nav-links');
  const button = document.querySelector('.nav-toggle');
  const isOpen = links.classList.toggle('open');
  button.setAttribute('aria-expanded', String(isOpen));
}

// Close nav when a link is clicked
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('nav-links').classList.remove('open');
      document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
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
    // The legacy command remains the only synchronous fallback for older
    // browsers; the local type avoids surfacing its deprecation as a check hint.
    /** @type {{ execCommand: (commandId: string) => boolean }} */ (document).execCommand('copy');
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
  { type: 'raw',    text: '    \u2597\u259f\u2588\u25cf\u2588\u2588\u2599\u25ba  finch v0.7.30', cls: 'bird', delay: 40 },
  { type: 'raw',    text: '  \u2590\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u258c  Qwen-2.5-7B \u00b7 CoreML \u00b7 ready', cls: 'bird', delay: 40 },
  { type: 'raw',    text: '  \u259d\u259c\u2588\u2588\u2588\u2588\u2588\u2588\u259b\u2598  ~/repos/myproject',                    cls: 'bird', delay: 40 },
  { type: 'raw',    text: '      \u2565  \u2565',                           cls: 'bird',     delay: 40 },
  { type: 'raw',    text: '     \u2572    \u2571',                          cls: 'bird',     delay: 200 },
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
  if (outEl) setTimeout(runDemo, 900);
});

// ── Comparison footnote tooltips ────────────────────
// Keep the numbered list as the canonical, no-JavaScript destination. This
// enhancement turns each table superscript into a real link and previews the
// corresponding note outside the table's overflow container.
function setupComparisonNotes() {
  const comparison = document.getElementById('compare');
  if (!comparison) return;

  const notes = [...comparison.querySelectorAll('.cmp-notes > li')];
  const references = comparison.querySelectorAll('.matrix sup');
  if (!notes.length || !references.length) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'cmp-note-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.appendChild(tooltip);

  let activeReference = null;

  function positionTooltip(reference) {
    if (tooltip.hidden) return;

    const referenceRect = reference.getBoundingClientRect();
    if (referenceRect.bottom < 0 || referenceRect.top > window.innerHeight) {
      tooltip.hidden = true;
      activeReference = null;
      return;
    }

    const gap = 10;
    const viewportPadding = 12;
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = referenceRect.left + referenceRect.width / 2 - tooltipRect.width / 2;
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipRect.width - viewportPadding));

    let top = referenceRect.bottom + gap;
    if (top + tooltipRect.height > window.innerHeight - viewportPadding) {
      top = referenceRect.top - tooltipRect.height - gap;
    }
    top = Math.max(viewportPadding, top);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function showTooltip(reference, note, number) {
    activeReference = reference;
    tooltip.textContent = `${number}. ${note.textContent.trim()}`;
    tooltip.hidden = false;
    positionTooltip(reference);
  }

  function hideTooltip(reference) {
    if (activeReference !== reference) return;
    tooltip.hidden = true;
    activeReference = null;
  }

  references.forEach((superscript, index) => {
    const number = Number.parseInt(superscript.textContent.trim(), 10);
    const note = notes[number - 1];
    if (!note) return;

    const noteId = `comparison-note-${number}`;
    note.id = noteId;

    const link = document.createElement('a');
    link.className = 'cmp-note-ref';
    link.href = `#${noteId}`;
    link.textContent = String(number);
    link.setAttribute('aria-label', `Comparison note ${number}`);
    link.setAttribute('aria-describedby', noteId);
    link.dataset.referenceIndex = String(index + 1);

    superscript.textContent = '';
    superscript.appendChild(link);

    link.addEventListener('pointerenter', () => showTooltip(link, note, number));
    link.addEventListener('pointerleave', () => hideTooltip(link));
    link.addEventListener('focus', () => showTooltip(link, note, number));
    link.addEventListener('blur', () => hideTooltip(link));
    link.addEventListener('click', () => hideTooltip(link));
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hideTooltip(link);
    });
  });

  window.addEventListener('resize', () => {
    if (activeReference) positionTooltip(activeReference);
  });
  window.addEventListener('scroll', () => {
    if (activeReference) positionTooltip(activeReference);
  }, { passive: true });
  comparison.querySelector('.table-wrap')?.addEventListener('scroll', () => {
    if (activeReference) positionTooltip(activeReference);
  }, { passive: true });
}

window.addEventListener('DOMContentLoaded', setupComparisonNotes);

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
