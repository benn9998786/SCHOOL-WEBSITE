/* Gallery page: photos uploaded through the Gallery Dashboard.
 *
 * Staff upload photos in the dashboard (src/gallery-dashboard, a Google Apps
 * Script web app). This script asks the dashboard for the visible photos and
 * adds them to the front of the gallery, newest first. The photos already in
 * gallery.html stay as they are.
 *
 * GALLERY_API is the dashboard's web app address (ends in /exec).
 * Leave it empty and the gallery shows only the built-in photos.
 */
(function () {
  const GALLERY_API = 'https://script.google.com/macros/s/AKfycbxWc49Vl4pXczPHDtOvK5qGRndWhH0Ez4z6J3olaZFLUriMAZNEr3qe_qlNo54OgHGV/exec';
  const MAX = 60;
  const CACHE_KEY = 'fa-gallery-v1';

  const grid = document.querySelector('#gallery-showcase .gallery-grid');
  if (!grid || !GALLERY_API) return;

  const validId = id => /^[\w-]{10,}$/.test(id);
  const src = (id, w) => 'https://lh3.googleusercontent.com/d/' + id + '=w' + w;

  function item(p) {
    const div = document.createElement('div');
    div.className = 'gallery-item uploaded' + (p.w && p.h && p.w / p.h > 1.6 ? ' wide' : '');
    div.dataset.cat = p.cat;
    div.dataset.uploadId = p.id;

    const img = document.createElement('img');
    img.src = src(p.id, 1600);
    img.srcset = src(p.id, 800) + ' 800w, ' + src(p.id, 1600) + ' 1600w';
    img.sizes = '(max-width:540px) 100vw, (max-width:760px) 50vw, 25vw';
    img.alt = p.caption;
    img.loading = 'lazy';
    img.decoding = 'async';
    /* Google refuses Drive photos when the request says which website asked for them */
    img.referrerPolicy = 'no-referrer';
    img.onerror = () => div.remove();

    const label = document.createElement('div');
    label.className = 'gallery-label';
    label.textContent = p.caption;

    div.append(img, label);
    div.tabIndex = 0;
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', 'Open photo: ' + p.caption);
    div.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); div.click(); }
    });
    return div;
  }

  function render(photos) {
    grid.querySelectorAll('.gallery-item.uploaded').forEach(el => el.remove());
    const active = document.querySelector('.gallery-filters button.active');
    const f = active ? active.dataset.filter : 'all';
    const frag = document.createDocumentFragment();
    photos.filter(p => p && validId(p.id) && p.caption).slice(0, MAX).forEach(p => {
      const el = item(p);
      if (f !== 'all' && p.cat !== f) el.classList.add('hide');
      frag.appendChild(el);
    });
    grid.prepend(frag);
  }

  /* Show what this visitor saw last time straight away, then refresh */
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.t < 7 * 864e5) render(cached.photos);
  } catch (e) { /* storage blocked */ }

  /* Load with a script tag (JSONP) so no extra server setup is needed */
  const cb = '__faGallery' + Date.now();
  const s = document.createElement('script');
  const cleanup = () => { try { delete window[cb]; } catch (e) { window[cb] = undefined; } s.remove(); };
  const timer = setTimeout(cleanup, 20000);
  window[cb] = res => {
    clearTimeout(timer);
    if (res && Array.isArray(res.photos)) {
      render(res.photos);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), photos: res.photos })); } catch (e) { /* ignore */ }
    }
    cleanup();
  };
  s.src = GALLERY_API + '?api=photos&callback=' + cb;
  s.async = true;
  s.onerror = () => { clearTimeout(timer); cleanup(); };
  document.head.appendChild(s);
})();
