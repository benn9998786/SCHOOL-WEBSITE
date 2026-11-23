/* Fr. Agnel Higher Secondary School — shared scripts (all pages) */
/* Slideshow (home page) */
(function(){
  const slidesEl = document.getElementById('slides');
  if (!slidesEl) return;
  const slideEls = slidesEl.querySelectorAll('.slide');
  const dotsEl = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0, autoplayTimer;
  const total = slideEls.length;
  slideEls.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Show slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });
  const dotEls = dotsEl.querySelectorAll('.dot');
  function update(){
    slidesEl.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function goTo(i){ current = (i + total) % total; update(); resetAutoplay(); }
  const next = () => goTo(current + 1), prev = () => goTo(current - 1);
  function resetAutoplay(){ clearInterval(autoplayTimer); autoplayTimer = setInterval(next, 4500); }
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  let touchStartX = 0;
  const sliderEl = document.getElementById('slider');
  sliderEl.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, {passive:true});
  sliderEl.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 50) prev(); else if (diff < -50) next();
  });
  resetAutoplay();
})();

/* Mobile menu */
(function(){
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!menuToggle || !navLinks) return;
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    const open = navLinks.classList.contains('show');
    menuToggle.textContent = open ? '✕' : '☰';
    menuToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('show');
    menuToggle.textContent = '☰';
  }));
})();

/* Smooth scrolling for links within the same page */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const id = this.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerHeight = document.querySelector('header').offsetHeight;
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({top:y, behavior:'smooth'});
  });
});

/* Motion layer: reveals, counters, timeline, particles, sayings, lightbox */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Run a callback once the logo preloader has finished */
  function whenOpened(cb){
    const p = document.getElementById('preloader');
    if(!p) return cb();
    document.addEventListener('preloader:done', () => cb(), {once:true});
  }

  /* Scroll reveal with stagger */
  const revealSel = '.section-title,.highlight,.principal-photo,.message,.timeline-item,.leader,.vision-item,.statute-card,.patron-frame,.patron-copy,.academic-category-heading,.academic-card,.syllabus-box,.values .card,.about-grid > div,.stat,.staff-photo,.event,.gallery-item,.prayer-card,.visit-card,.map-wrap,.gallery-filters,.welcome-photo,.welcome-copy,.stream-chip,.teaser-item,.visit-band-inner > *';
  if(!reduce && 'IntersectionObserver' in window){
    const els = [...document.querySelectorAll(revealSel)];
    els.forEach(el => {
      const sibs = [...el.parentElement.children].filter(c => c.matches(revealSel));
      el.style.setProperty('--rd', (Math.min(sibs.indexOf(el), 6) * 0.09) + 's');
      el.classList.add('reveal');
    });
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if(en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); }
    }), {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    whenOpened(() => els.forEach(el => io.observe(el)));
  }

  /* Animated counters */
  const counters = document.querySelectorAll('[data-count],[data-since]');
  counters.forEach(el => {
    const target = el.dataset.since ? new Date().getFullYear() - Number(el.dataset.since) : Number(el.dataset.count);
    el.dataset.target = target;
    el.textContent = target + (el.dataset.suffix || '');
  });
  if(!reduce && 'IntersectionObserver' in window){
    const cio = new IntersectionObserver(entries => entries.forEach(en => {
      if(!en.isIntersecting) return;
      cio.unobserve(en.target);
      const el = en.target, end = Number(el.dataset.target), start = Number(el.dataset.from || 0), suffix = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1800;
      (function step(now){
        const p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(start + (end - start) * eased) + suffix;
        if(p < 1) requestAnimationFrame(step);
      })(t0);
    }), {threshold:0.6});
    whenOpened(() => counters.forEach(el => cio.observe(el)));
  }

  /* Scroll-driven: progress bar, back-to-top, timeline fill */
  const bar = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');
  const timeline = document.getElementById('timeline');
  const tItems = timeline ? [...timeline.querySelectorAll('.timeline-item')] : [];
  const banner = document.querySelector('.campus-banner');
  let ticking = false;
  function onScroll(){
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    toTop.classList.toggle('show', scrollY > 700);
    if(timeline){
      const r = timeline.getBoundingClientRect(), mark = innerHeight * 0.6;
      const p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
      timeline.style.setProperty('--progress', (p * 100) + '%');
      tItems.forEach(it => it.classList.toggle('passed', it.getBoundingClientRect().top + 30 < mark));
    }
    if(banner && !reduce){
      const br = banner.getBoundingClientRect();
      if(br.bottom > 0 && br.top < innerHeight){
        banner.style.setProperty('--py', ((br.top + br.height / 2 - innerHeight / 2) * -0.12).toFixed(1) + 'px');
      }
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if(!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
  addEventListener('resize', onScroll);
  onScroll();
  toTop.addEventListener('click', () => scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}));

  /* Cursor spotlight on cards */
  document.querySelectorAll('.academic-card,.values .card,.vision-item,.visit-card,.prayer-card,.leader').forEach(el => {
    el.classList.add('spot');
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* Hero constellation particles */
  const canvas = document.getElementById('heroCanvas');
  if(canvas && !reduce){
    const hero = canvas.parentElement, ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, pts = [], running = false, mouse = {x:-9999, y:-9999};
    function size(){
      const r = hero.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 13000));
      pts = Array.from({length:n}, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
        r: Math.random() * 1.8 + .6, gold: Math.random() < .35
      }));
    }
    function tick(){
      if(!running) return;
      ctx.clearRect(0, 0, w, h);
      for(const p of pts){
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > w) p.vx *= -1;
        if(p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if(d > 0 && d < 120){ p.x += dx / d * 1.4; p.y += dy / d * 1.4; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? 'rgba(244,196,0,.9)' : 'rgba(255,255,255,.75)';
        ctx.fill();
      }
      for(let a = 0; a < pts.length; a++){
        for(let b = a + 1; b < pts.length; b++){
          const dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y, d2 = dx * dx + dy * dy;
          if(d2 < 13000){
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.16 * (1 - d2 / 13000)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    size();
    addEventListener('resize', size);
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([en]) => {
      const was = running; running = en.isIntersecting;
      if(running && !was) requestAnimationFrame(tick);
    }).observe(hero);
  }

  /* Patron sayings rotator */
  const sayings = document.getElementById('sayings');
  if(sayings){
    const items = [...sayings.querySelectorAll('.saying')];
    const dotsWrap = document.getElementById('sayingsDots');
    let s = 0, st;
    const dots = items.map((_, n) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Show saying ' + (n + 1));
      if(n === 0) b.className = 'active';
      b.addEventListener('click', () => { go(n); restart(); });
      dotsWrap.appendChild(b); return b;
    });
    function go(n){
      s = (n + items.length) % items.length;
      items.forEach((it, k) => it.classList.toggle('active', k === s));
      dots.forEach((d, k) => d.classList.toggle('active', k === s));
    }
    function restart(){ clearInterval(st); if(!reduce) st = setInterval(() => go(s + 1), 5500); }
    restart();
  }

  /* Gallery category filter */
  const filterBtns = document.querySelectorAll('.gallery-filters button');
  const gItems = document.querySelectorAll('#gallery-showcase .gallery-item');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.toggle('active', b === btn));
    gItems.forEach((it, n) => {
      const show = f === 'all' || it.dataset.cat === f;
      it.classList.toggle('hide', !show);
      it.classList.remove('pop');
      if(show && !reduce){
        void it.offsetWidth;
        it.style.animationDelay = (Math.min(n, 8) * 0.04) + 's';
        it.classList.add('pop');
      }
    });
  }));

  /* Gallery lightbox */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">✕</button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption');
  function closeLb(){ lb.classList.remove('open'); }
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img'), label = item.querySelector('.gallery-label');
      lbImg.src = img.src; lbImg.alt = img.alt;
      lbCap.textContent = label ? label.textContent : '';
      lb.classList.add('open');
    });
  });
  lb.addEventListener('click', e => { if(e.target !== lbImg) closeLb(); });
  addEventListener('keydown', e => { if(e.key === 'Escape') closeLb(); });
})();
/* Speed + effects: lazy slider, header behaviour, hero parallax, tilt, image fade-in */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Slider: load the other slides only when the slider is close to the screen */
  const slider = document.getElementById('slider');
  const lazySlides = slider ? slider.querySelectorAll('img[data-src]') : [];
  function loadSlides(){
    lazySlides.forEach(img => {
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
      img.removeAttribute('data-src'); img.removeAttribute('data-srcset');
    });
  }
  if (lazySlides.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { loadSlides(); io.disconnect(); } }, {threshold:0.15});
      io.observe(slider);
    } else loadSlides();
  }

  /* Images below the fold fade in when they finish loading */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete && img.naturalWidth) return;
    img.classList.add('fade-img');
    const done = () => img.classList.add('loaded');
    img.addEventListener('load', done, {once:true});
    img.addEventListener('error', done, {once:true});
  });

  /* Header: shrink after scrolling, hide on scroll down, show on scroll up */
  const header = document.querySelector('header');
  const navLinks = document.getElementById('navLinks');
  const heroBg = document.querySelector('.hero-bg, .page-hero-bg');
  let lastY = scrollY, ticking = false, holdUntil = 0;
  function onScroll(){
    const y = scrollY;
    header.classList.toggle('hdr-scrolled', y > 40);
    const menuOpen = navLinks && navLinks.classList.contains('show');
    if (performance.now() < holdUntil) holdUntil = performance.now() + 300; /* still gliding to a section */
    const dy = y - lastY; /* big jumps (menu links, restored scroll) do not count */
    if (!menuOpen && y > 500 && dy > 4 && dy < 250 && performance.now() > holdUntil) header.classList.add('hdr-hidden');
    if (y < lastY - 4 || y < 500) header.classList.remove('hdr-hidden');
    lastY = y;
    if (heroBg && !reduce && y < innerHeight * 1.2) heroBg.style.setProperty('--hy', (y * 0.3).toFixed(1) + 'px');
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
  onScroll();
  /* Never hide the header while jumping to a section from the menu */
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
    holdUntil = performance.now() + 1600; header.classList.remove('hdr-hidden');
  }));

  /* 3D tilt on event cards */
  if (!reduce && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.event').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (y * -10).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }
})();
