/* Notice board (home page).
 *
 * School staff add notices in a Google Sheet, and this script shows them in the
 * announcement bar and the "Latest Notices" list. No code changes are needed
 * to add or remove a notice; see the "How to use" tab in the sheet.
 *
 * The sheet must be shared as "Anyone with the link: Viewer".
 * Columns on the "Notices" tab: A Date | B Notice | C Link (optional) | D Show on website (Yes/No)
 */
(function () {
  const SHEET_ID = '1H0T7J7EoL5MVjJHa-VT4aLd9KAcjSJkdrpPSf6m0_hI';
  const TAB = 'Notices';
  const MAX = 6;
  const CACHE_KEY = 'fa-notices-v1';

  const ticker = document.querySelector('.ticker-content');
  const section = document.getElementById('notices');
  const list = document.getElementById('noticeList');
  if (!ticker && !list) return;

  const safeLink = u => /^https?:\/\/\S+$/i.test(String(u || '').trim()) ? String(u).trim() : '';

  /* Google returns dates as "Date(2026,10,26)" (month counts from 0) */
  function isoDate(v) {
    const m = /Date\((\d+),(\d+),(\d+)/.exec(v || '');
    if (!m) return '';
    return m[1] + '-' + String(+m[2] + 1).padStart(2, '0') + '-' + m[3].padStart(2, '0');
  }
  function niceDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function render(items) {
    if (!items || !items.length) return;

    if (ticker) {
      ticker.textContent = items.map(n => n.text).join('   •   ');
      const len = ticker.textContent.length;
      ticker.style.animationDuration = Math.max(20, Math.round(len * 0.2)) + 's';
    }

    if (list && section) {
      list.textContent = '';
      items.forEach(n => {
        const li = document.createElement('li');
        li.className = 'notice';
        if (n.date) {
          const t = document.createElement('time');
          t.dateTime = n.date;
          t.textContent = niceDate(n.date);
          li.appendChild(t);
        }
        const p = document.createElement('p');
        p.textContent = n.text;
        li.appendChild(p);
        if (n.link) {
          const a = document.createElement('a');
          a.href = n.link;
          a.target = '_blank';
          a.rel = 'noopener';
          a.className = 'notice-link';
          a.textContent = 'Open link';
          a.setAttribute('aria-label', 'Open link for notice: ' + n.text.slice(0, 60) + ' (opens in a new tab)');
          li.appendChild(a);
        }
        list.appendChild(li);
      });
      section.hidden = false;
    }
  }

  function parse(res) {
    if (!res || res.status === 'error' || !res.table) return null;
    return res.table.rows.map(r => {
      const c = r.c || [];
      const text = c[1] && c[1].v != null ? String(c[1].v).trim() : '';
      return { date: isoDate(c[0] && c[0].v), text, link: safeLink(c[2] && c[2].v) };
    }).filter(n => n.text).slice(0, MAX);
  }

  /* Show the last notices this visitor saw straight away, then refresh */
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.t < 7 * 864e5) render(cached.items);
  } catch (e) { /* storage blocked: just wait for the sheet */ }

  /* Load the sheet with a script tag (JSONP), which works without extra server setup */
  const cb = '__faNotices' + Date.now();
  const query = "select A,B,C where D = 'Yes' and B is not null order by A desc limit " + MAX;
  const s = document.createElement('script');
  const cleanup = () => { try { delete window[cb]; } catch (e) { window[cb] = undefined; } s.remove(); };
  const timer = setTimeout(cleanup, 15000);
  window[cb] = function (res) {
    clearTimeout(timer);
    const items = parse(res);
    if (items) {
      render(items);
      if (!items.length && section) section.hidden = true;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), items })); } catch (e) { /* ignore */ }
    }
    cleanup();
  };
  s.src = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?headers=1&sheet=' + encodeURIComponent(TAB) +
    '&tq=' + encodeURIComponent(query) + '&tqx=' + encodeURIComponent('out:json;responseHandler:' + cb);
  s.async = true;
  s.onerror = () => { clearTimeout(timer); cleanup(); };
  document.head.appendChild(s);
})();
