import { toast } from './utils.js';

/* ETA badge location:
   1. Not logged in                  -> auto-detect (ask permission -> GPS -> reverse geocode -> IP -> default)
   2. Logged in, no saved address    -> auto-detect (same as above)
   3. Logged in, has a saved address -> show the selected (or first) saved address
   Before the real browser geolocation prompt, we show our own banner explaining why —
   the browser dialog only fires if the visitor clicks "Allow location" there.
   Auto-detected results (and a "not now" dismissal) are cached in localStorage so we
   don't re-ask on every page load. */

const STORAGE_KEY = 'efm_eta_location';
const PROMPT_DISMISSED_KEY = 'efm_loc_prompt_dismissed';
const TOKEN_KEY = 'efm_token';
const DEFAULT_LOCATION = { label: 'HSR Layout, Bengaluru', lat: 12.9116, lng: 77.6473 };

const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://efixmate.com/api';

function paintLocation(label){
  const el = document.getElementById('etaLabel');
  if(el) el.textContent = label;
}

function readCached(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}

function cache(loc){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(loc)); } catch {}
}

// ─── Saved address (logged-in) ─────────────────────────────────────────────

function labelFromAddress(addr){
  const area = String(addr.address || '').split(',')[0]?.trim();
  const city = addr.city || '';
  if(area && city) return `${area}, ${city}`;
  return city || area || DEFAULT_LOCATION.label;
}

function pickAddress(list){
  const active = list.filter(a => (a.is_active ?? a.isActive) !== false);
  if(!active.length) return null;
  return active.find(a => a.is_selected ?? a.isSelected) || active[0];
}

async function getSavedAddress(token){
  try {
    const res = await fetch(`${API_BASE}/user/address`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(!res.ok) return null;
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    return pickAddress(list);
  } catch { return null; }
}

// ─── Auto-detect (GPS -> reverse geocode -> IP -> default) ────────────────

async function reverseGeocode(lat, lng){
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`, {
      headers: { Accept: 'application/json' },
    });
    if(!res.ok) throw new Error('reverse geocode failed');
    const data = await res.json();
    const a = data.address || {};
    const area = a.suburb || a.neighbourhood || a.residential || a.village || a.town || '';
    const city = a.city || a.town || a.state_district || a.county || '';
    if(!area && !city) return null;
    return { label: area && city ? `${area}, ${city}` : (area || city), lat, lng };
  } catch { return null; }
}

async function detectFromIP(){
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if(!res.ok) throw new Error('ip lookup failed');
    const d = await res.json();
    if(!d.city) return null;
    return { label: d.region ? `${d.city}, ${d.region}` : d.city, lat: d.latitude, lng: d.longitude };
  } catch { return null; }
}

function detectFromGPS(){
  return new Promise(resolve => {
    if(!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60 * 1000 }
    );
  });
}

async function locationFromGPS(){
  const pos = await detectFromGPS();
  if(!pos) return null;
  const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
  return geo || { label: DEFAULT_LOCATION.label, lat: pos.coords.latitude, lng: pos.coords.longitude };
}

async function locationFromIPOrDefault(){
  const ip = await detectFromIP();
  return ip || DEFAULT_LOCATION;
}

async function geoPermissionState(){
  try {
    if(!navigator.permissions?.query) return 'prompt';
    const status = await navigator.permissions.query({ name: 'geolocation' });
    return status.state; // 'granted' | 'denied' | 'prompt'
  } catch { return 'prompt'; }
}

// ─── Friendly pre-prompt banner (shown before the real browser permission dialog) ──

function ensureBannerEl(){
  let el = document.getElementById('locPrompt');
  if(el) return el;
  el = document.createElement('div');
  el.id = 'locPrompt';
  el.className = 'efm-loc-banner';
  el.innerHTML = `
    <span>Turn on location for accurate delivery time near you</span>
    <button type="button" class="efm-loc-btn efm-loc-allow" id="locAllow">Allow location</button>
    <button type="button" class="efm-loc-btn efm-loc-skip" id="locSkip">Not now</button>
  `;
  document.body.appendChild(el);
  return el;
}

function askLocationPermission(){
  return new Promise(resolve => {
    const el = ensureBannerEl();
    requestAnimationFrame(() => el.classList.add('efm-on'));

    const hide = () => el.classList.remove('efm-on');
    el.querySelector('#locAllow').onclick = () => { hide(); resolve(true); };
    el.querySelector('#locSkip').onclick = () => {
      hide();
      try { localStorage.setItem(PROMPT_DISMISSED_KEY, '1'); } catch {}
      resolve(false);
    };
  });
}

async function paintAutoDetected(){
  const cached = readCached();
  if(cached){ paintLocation(cached.label); return; }

  paintLocation(DEFAULT_LOCATION.label);

  const permission = await geoPermissionState();

  // Already decided by the user in a previous browser session -> respect it silently.
  if(permission === 'granted'){
    const loc = (await locationFromGPS()) || (await locationFromIPOrDefault());
    paintLocation(loc.label);
    cache(loc);
    return;
  }
  if(permission === 'denied' || localStorage.getItem(PROMPT_DISMISSED_KEY)){
    const loc = await locationFromIPOrDefault();
    paintLocation(loc.label);
    cache(loc);
    return;
  }

  // Undecided -> ask with our own banner first, then trigger the real browser prompt only on "Allow".
  const allowed = await askLocationPermission();
  const loc = allowed
    ? (await locationFromGPS()) || (await locationFromIPOrDefault())
    : await locationFromIPOrDefault();
  paintLocation(loc.label);
  cache(loc);
}

// ─── Entry point ────────────────────────────────────────────────────────────

export async function refreshLocation(){
  if(!document.getElementById('etaBox')) return;

  const token = localStorage.getItem(TOKEN_KEY);
  if(token){
    const addr = await getSavedAddress(token);
    if(addr){ paintLocation(labelFromAddress(addr)); return; }
  }

  await paintAutoDetected();
}

export function currentEtaLabel(){
  return document.getElementById('etaLabel')?.textContent || DEFAULT_LOCATION.label;
}

export function etaToast(){
  toast(`Delivering to ${currentEtaLabel()}`);
}
