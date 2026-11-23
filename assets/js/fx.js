/* Fr. Agnel HSS — extra animated graphics (all pages) */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const svgNS = 'http://www.w3.org/2000/svg';

  /* ---------- Floating school doodles in the banners ---------- */
  const DOODLES = {
    star:   '<svg viewBox="0 0 48 48"><path d="M24 3l6 14 15 1-11.5 10 3.5 15L24 35l-13 8 3.5-15L3 18l15-1z" fill="#f4c400"/></svg>',
    book:   '<svg viewBox="0 0 56 44"><path d="M4 6c8-3 16-3 24 3v32c-8-6-16-6-24-3z" fill="#fff"/><path d="M52 6c-8-3-16-3-24 3v32c8-6 16-6 24-3z" fill="#dbe8f7"/><path d="M10 14c5-1 9 0 13 2M10 21c5-1 9 0 13 2M33 16c4-2 8-3 13-2M33 23c4-2 8-3 13-2" stroke="#0d5aa7" stroke-width="2" stroke-linecap="round"/></svg>',
    pencil: '<svg viewBox="0 0 60 20"><rect x="8" y="4" width="40" height="12" rx="2" fill="#f4c400"/><rect x="48" y="4" width="7" height="12" rx="2" fill="#f28da0"/><path d="M8 4 L0 10 L8 16z" fill="#f6d8b0"/><path d="M0 10 L3 8 L3 12z" fill="#263548"/></svg>',
    atom:   '<svg viewBox="0 0 48 48" fill="none" stroke="#7cc4ff" stroke-width="2.5"><ellipse cx="24" cy="24" rx="21" ry="8"/><ellipse cx="24" cy="24" rx="21" ry="8" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="21" ry="8" transform="rotate(-60 24 24)"/><circle cx="24" cy="24" r="4" fill="#f4c400" stroke="none"/></svg>',
    cap:    '<svg viewBox="0 0 60 44"><path d="M30 4 L58 17 L30 30 L2 17z" fill="#fff"/><path d="M14 23 V33 C14 40 46 40 46 33 V23 L30 30z" fill="#dbe8f7"/><path d="M54 19 V34" stroke="#f4c400" stroke-width="3" stroke-linecap="round"/><circle cx="54" cy="37" r="3.5" fill="#f4c400"/></svg>',
    bulb:   '<svg viewBox="0 0 40 52"><path d="M20 3a15 15 0 0 0-9 27c2 2 3 4 3 7h12c0-3 1-5 3-7A15 15 0 0 0 20 3z" fill="#ffe36b"/><rect x="13" y="39" width="14" height="5" rx="2" fill="#dbe8f7"/><rect x="15" y="45" width="10" height="4" rx="2" fill="#dbe8f7"/><path d="M20 12v10M15 17h10" stroke="#b68a00" stroke-width="2.5" stroke-linecap="round"/></svg>',
    note:   '<svg viewBox="0 0 40 48"><path d="M14 36V8l22-5v28" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><ellipse cx="9" cy="37" rx="7" ry="5.5" fill="#fff"/><ellipse cx="31" cy="32" rx="7" ry="5.5" fill="#fff"/></svg>',
    ball:   '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#fff"/><path d="M24 14l8 6-3 9h-10l-3-9z" fill="#263548"/><path d="M24 4v10M32 20l10-3M29 29l6 9M19 29l-6 9M16 20L6 17" stroke="#263548" stroke-width="2"/></svg>',
  };
  const SPOTS = [
    ['star', 8, 18, 34, 1.4], ['book', 46, 12, 56, 1.0, 'hide-sm'], ['atom', 88, 16, 46, 1.6], ['pencil', 62, 78, 62, 0.8],
    ['cap', 14, 76, 58, 1.2, 'hide-sm'], ['bulb', 78, 64, 36, 1.8, 'hide-sm'], ['note', 32, 86, 30, 2.0], ['star', 94, 84, 24, 2.2], ['ball', 56, 30, 32, 1.1, 'hide-sm'],
  ];
  document.querySelectorAll('.hero, .page-hero').forEach(hero => {
    const box = document.createElement('div');
    box.className = 'doodles';
    box.setAttribute('aria-hidden', 'true');
    SPOTS.forEach(([kind, x, y, size, depth, cls], n) => {
      const d = document.createElement('span');
      d.className = 'doodle' + (cls ? ' ' + cls : '');
      d.style.cssText = `left:${x}%;top:${y}%;--size:${size}px;--depth:${depth};--n:${n};--float:${(6 + (n % 4) * 1.3).toFixed(1)}s;--delay:${(-n * 0.9).toFixed(1)}s;--r0:${n % 2 ? -8 : 6}deg;--r1:${n % 2 ? 10 : -7}deg`;
      d.innerHTML = DOODLES[kind];
      box.appendChild(d);
    });
    hero.insertBefore(box, hero.querySelector('.container'));
    if (!reduce && fine) {
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        box.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * -24).toFixed(1));
        box.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * -24).toFixed(1));
      });
      hero.addEventListener('pointerleave', () => { box.style.setProperty('--px', 0); box.style.setProperty('--py', 0); });
    }
  });

  /* ---------- Section headings: word-by-word, squiggle under the last word ---------- */
  document.querySelectorAll('.section-title h2').forEach(h2 => {
    if (h2.children.length) return;
    const words = h2.textContent.trim().split(/\s+/);
    h2.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'w';
      span.style.setProperty('--i', i);
      if (i === words.length - 1 && words.length > 1) {
        span.classList.add('squiggle');
        span.textContent = w;
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 200 20');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('aria-hidden', 'true');
        const p = document.createElementNS(svgNS, 'path');
        p.setAttribute('d', 'M3 12 C 30 3, 55 18, 82 10 S 135 4, 160 12 S 190 14, 197 8');
        p.setAttribute('pathLength', '1');
        svg.appendChild(p);
        span.appendChild(svg);
        h2.classList.add('has-squiggle');
      } else span.textContent = w;
      h2.appendChild(span);
      if (i < words.length - 1) h2.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- Orbiting icons around the principal's photo ---------- */
  document.querySelectorAll('.welcome-photo, .principal-figure .principal-photo').forEach(photo => {
    const wrap = document.createElement('div');
    wrap.className = 'orbit-wrap';
    photo.parentNode.insertBefore(wrap, photo);
    wrap.appendChild(photo);
    const orbit = document.createElement('div');
    orbit.className = 'orbit';
    orbit.setAttribute('aria-hidden', 'true');
    orbit.innerHTML = '<b>📚</b><b>🎓</b><b>⚽</b><b>🎨</b>';
    wrap.appendChild(orbit);
    const icons = [...orbit.children];
    let angle = 0, last = 0, visible = false;
    const place = () => {
      const w = orbit.clientWidth, h = orbit.clientHeight;
      icons.forEach((b, i) => {
        const t = angle + i * Math.PI / 2;
        b.style.transform = `translate(${(w / 2 + Math.cos(t) * w / 2).toFixed(1)}px,${(h / 2 + Math.sin(t) * h / 2).toFixed(1)}px)`;
      });
    };
    place();
    if (!reduce) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); requestAnimationFrame(spin); } }).observe(wrap);
      function spin(now){
        if (!visible) return;
        angle += (now - last) / 1000 * 0.24; last = now;
        place();
        requestAnimationFrame(spin);
      }
    }
    addEventListener('resize', place);
  });

  /* ---------- Glowing orbs in the visit band ---------- */
  document.querySelectorAll('.visit-band').forEach(band => {
    [['#f4c400', 260, '8%', '-40%', 0], ['#0d5aa7', 320, '62%', '20%', -4], ['#7cc4ff', 200, '40%', '-30%', -7]].forEach(([c, s, x, y, delay]) => {
      const o = document.createElement('span');
      o.className = 'glow-orb';
      o.style.cssText = `background:${c};width:${s}px;height:${s}px;left:${x};top:${y};animation-delay:${delay}s`;
      band.appendChild(o);
    });
  });

  /* ---------- Moving dot grid behind light sections ---------- */
  document.querySelectorAll('.streams-teaser, .academics-section, .values, .gallery-teaser').forEach(s => s.classList.add('dot-grid'));

  /* ---------- Second marquee row going the other way ---------- */
  document.querySelectorAll('.stream-marquee').forEach(m => {
    const copy = m.cloneNode(true);
    copy.classList.add('reverse');
    m.after(copy);
  });

  if (reduce) return;

  /* ---------- 3D tilt on cards ---------- */
  if (fine) {
    document.querySelectorAll('.values .card, .timeline-card, .prayer-card, .leader, .visit-card').forEach(card => {
      card.classList.add('tilt');
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -12).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px');
        btn.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', () => { btn.style.setProperty('--bx', '0px'); btn.style.setProperty('--by', '0px'); });
    });
  }

  /* ---------- Cursor ring that follows the mouse ---------- */
  if (fine) {
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    document.body.append(ring, dot);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, shown = false;
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; document.documentElement.classList.add('has-cursor'); }
      dot.style.transform = `translate(${x}px,${y}px)`;
      ring.classList.toggle('is-link', !!e.target.closest('a, button, .gallery-item, .stream-chip, .teaser-item, [role="button"]'));
    }, {passive:true});
    document.addEventListener('pointerleave', () => document.documentElement.classList.remove('has-cursor'));
    document.addEventListener('pointerenter', () => { if (shown) document.documentElement.classList.add('has-cursor'); });
    addEventListener('pointerdown', () => ring.classList.add('is-down'));
    addEventListener('pointerup', () => ring.classList.remove('is-down'));
    (function follow(){
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
      ring.style.transform = `translate(${rx.toFixed(1)}px,${ry.toFixed(1)}px)`;
      requestAnimationFrame(follow);
    })();
  }
})();
