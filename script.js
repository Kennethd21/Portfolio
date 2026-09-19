// Digital Workbench Interactivity & Motion Suite
const workbench = document.querySelector('.workbench');
const layers = [...document.querySelectorAll('[data-depth]')];

// 3D Parallax Movement on Mouse Pointer
if (workbench) {
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isMoving = false;

  window.addEventListener('pointermove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });

  function updateParallax() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth) || 0.1;
      const base = layer.classList.contains('hero__artifact') ? ' rotate(2deg)' : '';
      layer.style.transform = `translate(${currentX * depth * 22}px, ${currentY * depth * 16}px)${base}`;
    });

    if (Math.abs(mouseX - currentX) > 0.005 || Math.abs(mouseY - currentY) > 0.005) {
      requestAnimationFrame(updateParallax);
    } else {
      isMoving = false;
    }
  }
}

// Hardware Panel: Mode Switch & Ambience Meter
const meterValue = document.querySelector('[data-meter-value]');
const meterTrack = document.querySelector('.meter-track span');

document.querySelectorAll('.mode-switch__button').forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.mode;
    if (workbench) workbench.dataset.deskMode = mode;
    document.querySelectorAll('.mode-switch__button').forEach((item) => item.classList.toggle('is-active', item === button));

    if (meterValue && meterTrack) {
      const targetVal = mode === 'explore' ? 94 : 68;
      let startVal = parseInt(meterValue.textContent, 10) || 68;
      const step = startVal < targetVal ? 1 : -1;
      const timer = setInterval(() => {
        if (startVal === targetVal) {
          clearInterval(timer);
        } else {
          startVal += step;
          meterValue.textContent = startVal;
        }
      }, 15);
      meterTrack.style.width = `${targetVal}%`;
    }
  });
});

// Scroll Reveal Animations — re-trigger on every scroll-in/out
const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      } else {
        entry.target.classList.remove('is-revealed');
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-revealed'));
}

// Skill switchers
document.querySelectorAll('.skill-switch').forEach((switcher) => {
  switcher.addEventListener('click', () => {
    switcher.classList.toggle('is-active');
  });
});

// Project filters
const projectArchive = document.querySelector('.project-archive');
if (projectArchive) {
  const projectCards = [...projectArchive.querySelectorAll('.project-card')];
  projectArchive.classList.toggle('is-odd', projectCards.length % 2 === 1);
  document.querySelectorAll('.project-filter').forEach((filter) => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;
      document.querySelectorAll('.project-filter').forEach((item) => item.classList.toggle('is-active', item === filter));
      projectCards.forEach((card) => {
        card.hidden = category !== 'all' && card.dataset.category !== category;
      });
    });
  });
}

// Custom Cat Cursor
const catCursor = document.querySelector('.cat-cursor');
if (catCursor) {
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let curX = cursorX;
  let curY = cursorY;
  let rafId = null;

  document.addEventListener('pointermove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    catCursor.classList.add('is-visible');

    if (!rafId) {
      rafId = requestAnimationFrame(renderCursor);
    }
  }, { passive: true });

  function renderCursor() {
    curX += (cursorX - curX) * 0.25;
    curY += (cursorY - curY) * 0.25;
    catCursor.style.left = `${curX}px`;
    catCursor.style.top = `${curY}px`;

    if (Math.abs(cursorX - curX) > 0.5 || Math.abs(cursorY - curY) > 0.5) {
      rafId = requestAnimationFrame(renderCursor);
    } else {
      rafId = null;
    }
  }

  document.addEventListener('pointerover', (event) => {
    const target = event.target instanceof Element ? event.target.closest('a, button, input, textarea, .desk-sticker, .skill-switch, .portrait-frame__image-wrap, [data-clickable]') : null;
    if (!target) return;
    catCursor.classList.add('is-hovering');
    const state = catCursor.querySelector('.cat-cursor__state');
    if (state) {
      if (target.closest('.desk-sticker')) {
        state.textContent = 'MEOW!';
      } else if (target.closest('.portrait-frame__image-wrap:not(.is-unlocked)')) {
        state.textContent = 'SCRATCH!';
      } else if (target.matches('a')) {
        state.textContent = 'GO';
      } else {
        state.textContent = 'TAP';
      }
    }
  });

  document.addEventListener('pointerout', (event) => {
    const target = event.target instanceof Element ? event.target.closest('a, button, input, textarea, .desk-sticker, .skill-switch, .portrait-frame__image-wrap, [data-clickable]') : null;
    const next = event.relatedTarget instanceof Element ? event.relatedTarget.closest('a, button, input, textarea, .desk-sticker, .skill-switch, .portrait-frame__image-wrap, [data-clickable]') : null;
    if (target && !next) catCursor.classList.remove('is-hovering');
  });
}

// Scroll Progress
const scrollProgress = document.querySelector('[data-scroll-progress]');
const updateScrollProgress = () => {
  if (!scrollProgress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// Section markers and heads scroll trigger
const scrollTargets = document.querySelectorAll(
  '.about-section__marker, .capabilities-section__marker, .projects-section__marker, .experience-section__marker, .contact-section__marker, .capabilities-head, .projects-head, .experience-head, .contact-head'
);

if (!('IntersectionObserver' in window)) {
  scrollTargets.forEach((target) => target.classList.add('is-visible'));
} else {
  // Re-trigger section heading animations every time they enter/leave viewport
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.15 });
  scrollTargets.forEach((target) => scrollObserver.observe(target));
}

// rAF-throttled scroll fallback for browsers without IntersectionObserver
let scrollRAF = null;
const updateScrollAnimations = () => {
  if (scrollRAF) return;
  scrollRAF = requestAnimationFrame(() => {
    scrollRAF = null;
    scrollTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        target.classList.add('is-visible');
      } else {
        target.classList.remove('is-visible');
      }
    });
  });
};
window.addEventListener('scroll', updateScrollAnimations, { passive: true });
window.addEventListener('resize', updateScrollAnimations);
updateScrollAnimations();

// ─── AURORA CANVAS PARTICLE SYSTEM ──────────────────────────────────────────
(function initAurora() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  // Aurora orb colors — neon electric palette
  const COLORS = [
    'rgba(0, 255, 135, ',    // electric green
    'rgba(124, 58, 237, ',   // vivid violet
    'rgba(14, 165, 233, ',   // sky blue
    'rgba(249, 115, 22, ',   // neon orange
    'rgba(236, 72, 153, ',   // hot pink
    'rgba(0, 230, 255, ',    // cyan
    'rgba(180, 255, 80, ',   // lime
  ];

  let W = 0, H = 0;
  let orbs = [];
  let sparks = [];
  let raf;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Large slow-drifting orbs
  class Orb {
    constructor() { this.reset(true); }
    reset(fresh) {
      this.x = Math.random() * W;
      this.y = fresh ? Math.random() * H : H + 100;
      this.r = 120 + Math.random() * 200;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = 0.04 + Math.random() * 0.09;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(0.12 + Math.random() * 0.2);
      this.life = 0;
      this.maxLife = 600 + Math.random() * 400;
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.life++;
      this.x += this.vx + Math.sin(this.life * 0.008 + this.phase) * 0.4;
      this.y += this.vy;
      // pulse
      const pulse = 0.7 + 0.3 * Math.sin(this.life * 0.015 + this.phase);
      this.currentAlpha = this.alpha * pulse *
        Math.min(1, this.life / 80) *
        Math.min(1, (this.maxLife - this.life) / 80);
      if (this.life > this.maxLife || this.y < -this.r * 2) this.reset(false);
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, this.color + this.currentAlpha + ')');
      g.addColorStop(0.5, this.color + (this.currentAlpha * 0.4) + ')');
      g.addColorStop(1, this.color + '0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Tiny spark/firefly particles
  class Spark {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = H * 0.3 + Math.random() * H * 0.7;
      this.r = 1 + Math.random() * 2.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = 0;
      this.targetAlpha = 0.4 + Math.random() * 0.6;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -(0.3 + Math.random() * 0.8);
      this.life = 0;
      this.maxLife = 150 + Math.random() * 200;
    }
    update() {
      this.life++;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha = this.targetAlpha *
        Math.min(1, this.life / 30) *
        Math.min(1, (this.maxLife - this.life) / 40);
      if (this.life > this.maxLife) this.reset();
    }
    draw() {
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color + '0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Init orbs and sparks
  for (let i = 0; i < 7; i++) orbs.push(new Orb());
  for (let i = 0; i < 55; i++) sparks.push(new Spark());

  // Optional: react to mouse — nearby orbs shift toward cursor
  let mx = W / 2, my = H / 2;
  window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Draw orbs
    orbs.forEach((orb) => {
      // Subtle mouse attraction
      const dx = mx - orb.x, dy = my - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 500) {
        orb.x += (dx / dist) * 0.08;
        orb.y += (dy / dist) * 0.05;
      }
      orb.update();
      orb.draw();
    });

    // Draw sparks
    sparks.forEach((s) => { s.update(); s.draw(); });

    raf = requestAnimationFrame(tick);
  }

  // Only animate when visible
  const visObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(tick); }
      else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    });
  });
  visObs.observe(canvas);
  raf = requestAnimationFrame(tick);
})();

// ─── INTERACTIVE SCRATCH-TO-REVEAL HERO PORTRAIT ─────────────────────────
(function initScratchCard() {
  const wrap = document.getElementById('portrait-scratch-wrap');
  const canvas = document.getElementById('portrait-scratch-canvas');
  const hint = document.getElementById('portrait-scratch-hint');
  const resetBtn = document.getElementById('portrait-scratch-reset');
  if (!wrap || !canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let isScratching = false;
  let isUnlocked = false;
  let lastX = 0;
  let lastY = 0;
  let checkThrottleTimer = null;
  let dpr = window.devicePixelRatio || 1;
  let cardW = 0;
  let cardH = 0;

  function renderCoating() {
    const rect = wrap.getBoundingClientRect();
    cardW = Math.round(rect.width);
    cardH = Math.round(rect.height);

    // Fallback dimensions if element not yet laid out
    if (cardW === 0 || cardH === 0) {
      cardW = wrap.offsetWidth || 340;
      cardH = wrap.offsetHeight || 480;
    }

    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cardW * dpr);
    canvas.height = Math.round(cardH * dpr);
    canvas.style.width = `${cardW}px`;
    canvas.style.height = `${cardH}px`;
    canvas.style.opacity = '1';

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'source-over';

    // Base dark metallic carbon gradient
    const grad = ctx.createLinearGradient(0, 0, cardW, cardH);
    grad.addColorStop(0, '#262d29');
    grad.addColorStop(0.5, '#1e2320');
    grad.addColorStop(1, '#161917');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cardW, cardH);

    // Diagonal security grid hatch
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = -cardH; i < cardW + cardH; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + cardH, cardH);
      ctx.stroke();
    }

    // Metallic grain flecks
    ctx.fillStyle = 'rgba(238, 232, 220, 0.035)';
    for (let j = 0; j < 350; j++) {
      const rx = Math.random() * cardW;
      const ry = Math.random() * cardH;
      const rw = Math.random() * 2 + 0.5;
      ctx.fillRect(rx, ry, rw, rw);
    }

    // Technical perimeter dashed border
    ctx.strokeStyle = 'rgba(228, 109, 63, 0.42)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(10, 10, cardW - 20, cardH - 20);
    ctx.setLineDash([]);

    // Corner registration crosshairs
    const corners = [
      [18, 18],
      [cardW - 18, 18],
      [18, cardH - 18],
      [cardW - 18, cardH - 18]
    ];
    ctx.strokeStyle = '#e46d3f';
    ctx.lineWidth = 1.5;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy); ctx.lineTo(cx + 5, cy);
      ctx.moveTo(cx, cy - 5); ctx.lineTo(cx, cy + 5);
      ctx.stroke();
    });

    // Technical watermark typography
    ctx.font = '600 8px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(255, 135, 84, 0.7)';
    ctx.fillText('SECURITY FOIL // CLASSIFIED', 24, 28);
    ctx.textAlign = 'right';
    ctx.fillText('REF: PORTRAIT-001', cardW - 24, 28);

    // Center watermark lock/sparkle badge
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(238, 232, 220, 0.2)';
    ctx.font = '700 24px "Manrope", sans-serif';
    ctx.fillText('✦ ✦ ✦', cardW / 2, cardH / 2 - 12);
    ctx.font = '700 11px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(238, 232, 220, 0.32)';
    ctx.fillText('[ SCRATCH SURFACE TO DECODE ]', cardW / 2, cardH / 2 + 14);

    // Bottom spec note
    ctx.font = '500 7.5px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(148, 183, 198, 0.4)';
    ctx.fillText('JAUSH D’SOUZA // PORTRAIT 001', cardW / 2, cardH - 20);

    ctx.restore();

    canvas.style.display = 'block';
    canvas.style.opacity = '1';
    scratchCount = 0;
    isUnlocked = false;
    wrap.classList.remove('is-unlocked', 'is-scratching');
  }

  // Create scratch particle sparks
  function spawnScratchSpark(x, y) {
    const spark = document.createElement('div');
    spark.className = 'scratch-spark';
    const size = Math.random() * 4 + 3;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 22 + 10;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    spark.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${Math.random() > 0.4 ? '#ff8754' : '#eee8dc'};
      box-shadow: 0 0 6px #ff8754;
      pointer-events: none;
      z-index: 10;
      transition: transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.4s ease;
      transform: translate(0, 0) scale(1);
    `;
    wrap.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
      spark.style.opacity = '0';
    });
    setTimeout(() => spark.remove(), 420);
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    return {
      x: (clientX !== undefined ? clientX : 0) - rect.left,
      y: (clientY !== undefined ? clientY : 0) - rect.top
    };
  }

  let scratchCount = 0;

  function scratch(x, y) {
    if (isUnlocked) return;

    if (canvas.width === 0 || canvas.height === 0 || cardW === 0) {
      renderCoating();
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(48, Math.min(68, cardW * 0.15));

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    lastX = x;
    lastY = y;
    scratchCount++;

    if (Math.random() > 0.3) spawnScratchSpark(x, y);

    scheduleCheck();
  }

  function scheduleCheck() {
    if (checkThrottleTimer || isUnlocked) return;
    checkThrottleTimer = setTimeout(() => {
      checkThrottleTimer = null;
      checkScratchedPercentage();
    }, 80);
  }

  function checkScratchedPercentage() {
    if (isUnlocked) return;
    try {
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;
      const imgData = ctx.getImageData(0, 0, cw, ch);
      const data = imgData.data;
      const step = 8 * 4; // Sample every 8th pixel
      let transparentCount = 0;
      let totalSamples = 0;

      for (let i = 3; i < data.length; i += step) {
        totalSamples++;
        if (data[i] < 180) { // Count any pixel that is translucent/cleared
          transparentCount++;
        }
      }

      const ratio = transparentCount / totalSamples;
      // Auto unlock when 50% of the surface area is scratched
      if (ratio >= 0.50) {
        unlockCard();
      }
    } catch (err) {
      // Fallback
    }
  }

  function unlockCard() {
    if (isUnlocked) return;
    isUnlocked = true;
    wrap.classList.add('is-unlocked');

    // Fade out canvas and clear completely to reveal full card
    canvas.style.transition = 'opacity 0.4s ease';
    canvas.style.opacity = '0';
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }, 400);

    // Particle burst celebration
    for (let k = 0; k < 24; k++) {
      setTimeout(() => {
        spawnScratchSpark(
          Math.random() * (cardW || 380),
          Math.random() * (cardH || 260)
        );
      }, k * 20);
    }
  }

  function onStart(e) {
    if (isUnlocked) return;
    if (e.type === 'touchstart') e.preventDefault();
    if (e.target && e.target.setPointerCapture && e.pointerId !== undefined) {
      try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
    }
    isScratching = true;
    wrap.classList.add('is-scratching');
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
    scratch(pos.x, pos.y);
  }

  function onMove(e) {
    if (!isScratching || isUnlocked) return;
    if (e.type === 'touchmove') e.preventDefault();
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  }

  function onEnd(e) {
    if (!isScratching) return;
    if (e && e.target && e.target.releasePointerCapture && e.pointerId !== undefined) {
      try { e.target.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    isScratching = false;
    if (!isUnlocked) checkScratchedPercentage();
  }

  // Bind pointer, touch, and mouse listeners
  canvas.addEventListener('pointerdown', onStart, { passive: false });
  canvas.addEventListener('touchstart', onStart, { passive: false });
  canvas.addEventListener('mousedown', onStart, { passive: false });

  window.addEventListener('pointermove', onMove, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mousemove', onMove, { passive: false });

  window.addEventListener('pointerup', onEnd);
  window.addEventListener('pointercancel', onEnd);
  window.addEventListener('touchend', onEnd);
  window.addEventListener('mouseup', onEnd);

  // Click on hint pill unlocks card directly
  if (hint) {
    hint.addEventListener('click', () => {
      if (!isUnlocked) unlockCard();
    });
  }

  // Keyboard accessibility
  wrap.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isUnlocked) {
      e.preventDefault();
      unlockCard();
    }
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderCoating();
    });
  }

  // ResizeObserver ensures canvas re-renders as soon as element has dimensions
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          if (!isUnlocked && (cardW !== Math.round(entry.contentRect.width) || cardH !== Math.round(entry.contentRect.height))) {
            renderCoating();
          }
        }
      }
    });
    ro.observe(wrap);
  }

  // IntersectionObserver ensures render when scrolled into view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isUnlocked) {
          renderCoating();
        }
      });
    }, { threshold: 0.1 });
    io.observe(wrap);
  }

  // Setup initial render
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(renderCoating);
  } else {
    setTimeout(renderCoating, 100);
  }
})();

