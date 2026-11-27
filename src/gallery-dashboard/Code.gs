/**
 * Fr. Agnel HSS website: photo gallery dashboard (Google Apps Script).
 *
 * Staff open the dashboard link, enter the PIN and upload photos. Photos are
 * saved in Google Drive, listed in a Google Sheet, and shown on the website's
 * Gallery page (assets/js/gallery-uploads.js reads them from this script).
 *
 * Setup steps are in README.md next to this file. The PIN lives in
 * Project Settings > Script properties > UPLOAD_PIN, never in this code.
 */

/* Must match the filter buttons on the website's Gallery page */
const CATEGORIES = {
  learning: 'Learning',
  celebrations: 'Celebrations',
  culture: 'Culture',
  faith: 'Faith',
};

const FOLDER_NAME = 'Fr. Agnel HSS website gallery photos';
const SHEET_NAME = 'Fr. Agnel HSS website gallery list';
const HEADERS = ['Uploaded', 'Photo ID', 'Caption', 'Category', 'Show on website', 'Uploaded by', 'Width', 'Height'];
const MAX_BYTES = 8 * 1024 * 1024;
const CACHE_KEY = 'public-photos-v1';

/* ---------- Web app entry point ---------- */

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.api === 'photos') return publicPhotos_(p.callback);
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('Gallery Dashboard | Fr. Agnel HSS')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* Photos the website shows (visible ones only), as JSON or JSONP */
function publicPhotos_(callback) {
  const cache = CacheService.getScriptCache();
  let json = cache.get(CACHE_KEY);
  if (!json) {
    const photos = readRows_()
      .filter(r => r.visible)
      .map(r => ({ id: r.id, caption: r.caption, cat: r.cat, w: r.w, h: r.h, date: r.date }));
    json = JSON.stringify({ photos });
    cache.put(CACHE_KEY, json, 300);
  }
  if (callback && /^[A-Za-z_$][\w$]{0,63}$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Called from the dashboard ---------- */

function checkPin(pin) {
  requirePin_(pin);
  return { ok: true, categories: CATEGORIES };
}

function listPhotos(pin) {
  requirePin_(pin);
  return readRows_();
}

/* data: { base64, caption, cat, by, w, h } with the photo already resized to JPEG in the browser */
function uploadPhoto(pin, data) {
  requirePin_(pin);
  const caption = clean_(data.caption, 120);
  const by = clean_(data.by, 60);
  if (!caption) throw new Error('Please type a caption.');
  if (!CATEGORIES[data.cat]) throw new Error('Please choose a category.');
  const bytes = Utilities.base64Decode(String(data.base64 || ''));
  if (!bytes.length) throw new Error('The photo was empty.');
  if (bytes.length > MAX_BYTES) throw new Error('The photo is too large.');

  const stamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HHmmss');
  const blob = Utilities.newBlob(bytes, 'image/jpeg', stamp + ' ' + caption.slice(0, 40) + '.jpg');
  const file = store_().folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  file.setDescription(caption);

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    store_().sheet.appendRow([new Date(), file.getId(), caption, data.cat, 'Yes', by, Number(data.w) || '', Number(data.h) || '']);
  } finally {
    lock.releaseLock();
  }
  clearCache_();
  return { id: file.getId() };
}

function setVisible(pin, id, visible) {
  requirePin_(pin);
  const row = findRow_(id);
  store_().sheet.getRange(row, 5).setValue(visible ? 'Yes' : 'No');
  clearCache_();
  return true;
}

/* Change a photo's caption and category after upload */
function updatePhoto(pin, id, caption, cat) {
  requirePin_(pin);
  const text = clean_(caption, 120);
  if (!text) throw new Error('Please type a caption.');
  if (!CATEGORIES[cat]) throw new Error('Please choose a category.');
  const row = findRow_(id);
  store_().sheet.getRange(row, 3, 1, 2).setValues([[text, cat]]);
  try { DriveApp.getFileById(id).setDescription(text); } catch (err) { /* file missing: list still updated */ }
  clearCache_();
  return true;
}

function deletePhoto(pin, id) {
  requirePin_(pin);
  const row = findRow_(id);
  try { DriveApp.getFileById(id).setTrashed(true); } catch (err) { /* already gone */ }
  store_().sheet.deleteRow(row);
  clearCache_();
  return true;
}

/* ---------- Helpers ---------- */

function requirePin_(pin) {
  const real = PropertiesService.getScriptProperties().getProperty('UPLOAD_PIN');
  if (!real) throw new Error('Setup is not finished: add UPLOAD_PIN in Project Settings > Script properties.');
  if (String(pin || '') !== String(real)) {
    Utilities.sleep(1200); /* slows down guessing */
    throw new Error('Wrong PIN.');
  }
}

/* The Drive folder and Sheet, created on first use and remembered */
function store_() {
  const props = PropertiesService.getScriptProperties();
  let folder, ss;
  try { folder = DriveApp.getFolderById(props.getProperty('FOLDER_ID')); } catch (e) { folder = null; }
  if (!folder) {
    folder = DriveApp.createFolder(FOLDER_NAME);
    props.setProperty('FOLDER_ID', folder.getId());
  }
  try { ss = SpreadsheetApp.openById(props.getProperty('SHEET_ID')); } catch (e) { ss = null; }
  if (!ss) {
    ss = SpreadsheetApp.create(SHEET_NAME);
    const sh = ss.getSheets()[0];
    sh.setName('Photos');
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    props.setProperty('SHEET_ID', ss.getId());
  }
  return { folder, sheet: ss.getSheetByName('Photos') || ss.getSheets()[0] };
}

function readRows_() {
  const sh = store_().sheet;
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, HEADERS.length).getValues()
    .filter(v => v[1])
    .map(v => ({
      date: v[0] instanceof Date ? Utilities.formatDate(v[0], 'Asia/Kolkata', 'yyyy-MM-dd') : String(v[0] || ''),
      id: String(v[1]),
      caption: String(v[2] || ''),
      cat: CATEGORIES[v[3]] ? v[3] : 'learning',
      visible: String(v[4]).trim().toLowerCase() === 'yes',
      by: String(v[5] || ''),
      w: Number(v[6]) || 0,
      h: Number(v[7]) || 0,
    }))
    .reverse(); /* newest first */
}

function findRow_(id) {
  const sh = store_().sheet;
  const ids = sh.getRange(2, 2, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  throw new Error('That photo was not found. Refresh the list and try again.');
}

function clean_(s, max) {
  return String(s || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function clearCache_() {
  CacheService.getScriptCache().remove(CACHE_KEY);
}

/* Run this once from the editor (Run > setup) to create the folder and sheet and grant permissions */
function setup() {
  const s = store_();
  Logger.log('Photos folder: ' + s.folder.getUrl());
  Logger.log('Photo list sheet: ' + s.sheet.getParent().getUrl());
}
