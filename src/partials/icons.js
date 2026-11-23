/*
 * Line icons used across the site (24x24, drawn with the current text colour).
 * build.js puts these in every page and swaps the emoji in src/ for them,
 * so icons look the same on every phone and computer.
 */
const SYMBOLS = {
  grad:      '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2.7 9 2.7 12 0v-5"/><path d="M22 10v6"/>',
  sprout:    '<path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12C12 8 9 5 4 5c0 4 3 7 8 7z"/><path d="M12 12c0-3 2-6 7-6 0 3-2 6-7 6z"/>',
  trophy:    '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8 21h8M10 17h4v4h-4z"/>',
  users:     '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.8"/><path d="M16 14.2c3.2-.4 5.5 1.9 5.5 5"/>',
  ball:      '<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 4.5h-5L8 10z"/><path d="M12 3v4M16 10l4.5-1.5M14.5 14.5l2.5 4M9.5 14.5 7 18.5M8 10 3.5 8.5"/>',
  palette:   '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.8-.6-1.2-.6-2 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4c0-4.9-4-8.8-9-8.8z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10" cy="7" r="1.1"/><circle cx="15" cy="7.5" r="1.1"/>',
  music:     '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  bulb:      '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  laptop:    '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 20h20"/>',
  chart:     '<path d="M3 3v18h18"/><path d="M8 16v-5M13 16V8M18 16V7"/>',
  pin:       '<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  book:      '<path d="M2 5c3-1.3 6.5-1.3 10 1 3.5-2.3 7-2.3 10-1v14c-3-1.3-6.5-1.3-10 1-3.5-2.3-7-2.3-10-1z"/><path d="M12 6v14"/>',
  phone:     '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  mail:      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l8 5V5L7 10H4a1 1 0 0 0-1 1z"/><path d="M19 9a4 4 0 0 1 0 6"/>',
  flask:     '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
  clock:     '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  folder:    '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  cross:     '<path d="M12 3v18M7 8h10"/>',
  car:       '<path d="M5 16h14v-3l-2-5H7l-2 5z"/><path d="M4 13h16"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>',
  shield:    '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
};

/* Emoji in src/ -> icon name */
const EMOJI = {
  '\u{1F393}': 'grad', '\u{1F331}': 'sprout', '\u{1F3C6}': 'trophy', '\u{1F91D}': 'users', '⚽': 'ball',
  '\u{1F3A8}': 'palette', '\u{1F3B5}': 'music', '\u{1F4A1}': 'bulb', '\u{1F4BB}': 'laptop', '\u{1F4CA}': 'chart',
  '\u{1F4CD}': 'pin', '\u{1F4DA}': 'book', '\u{1F4DE}': 'phone', '☎': 'phone', '✉': 'mail',
  '\u{1F4E2}': 'megaphone', '\u{1F52C}': 'flask', '\u{1F557}': 'clock', '\u{1F5C2}': 'folder', '\u{1F64F}': 'cross',
  '\u{1F697}': 'car', '\u{1F6E1}': 'shield',
};

const icon = name => `<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

const sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
  Object.entries(SYMBOLS).map(([id, body]) => `<symbol id="i-${id}" viewBox="0 0 24 24">${body}</symbol>`).join('') +
  '</defs></svg>';

function iconize(html) {
  const chars = Object.keys(EMOJI).join('|');
  return html.replace(new RegExp(`(?:${chars})\\uFE0F?`, 'gu'), m => icon(EMOJI[m.replace('️', '')]));
}

module.exports = { sprite, iconize, icon };
