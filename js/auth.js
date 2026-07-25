import { $, toast } from './utils.js';

/* ========== login: phone + OTP against the real eFixMate user API ==========
   Local dev: the Express server's CORS allowlist auto-permits any localhost
   origin when NODE_ENV=development, so calling it from this static page's
   dev server works with no extra config. Production is NOT wired: the
   backend's CORS_ORIGINS only allows https://efixmate.com today, so this
   landing page's own production domain must be added there before login
   will work once deployed. */
const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://efixmate.com/api';

const TOKEN_KEY = 'efm_token', USER_KEY = 'efm_user';

let step = 'phone', pendingPhone = '', pendingLoginId = null, resendTimer = null;

const getToken = () => localStorage.getItem(TOKEN_KEY);
const getUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } };

async function api(path, body){
  let res, json;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Could not reach the server. Is the API running?');
  }
  try { json = await res.json(); } catch { json = null; }
  if(!res.ok || !json || json.status === false) throw new Error(json?.message || `Request failed (${res.status})`);
  return json;
}

function showError(msg){
  const el = $('#loginError');
  el.textContent = msg; el.classList.remove('efm-hide');
}
function clearError(){ $('#loginError').classList.add('efm-hide'); }

function paintStep(){
  $('#loginPhoneStep').classList.toggle('efm-hide', step !== 'phone');
  $('#loginOtpStep').classList.toggle('efm-hide', step !== 'otp');
  $('#loginSub').textContent = step === 'phone' ? 'Enter your mobile number' : 'Verify the code we sent you';
  $('#loginSubmitL').textContent = step === 'phone' ? 'Send OTP' : 'Verify & log in';
  if(step === 'otp'){ $('#loginPhoneEcho').textContent = pendingPhone; setTimeout(()=>$('#loginOtp').focus(), 50); }
  else setTimeout(()=>$('#loginPhone').focus(), 50);
}

function startResendCooldown(){
  let left = 30;
  const btn = $('#loginResend');
  btn.disabled = true;
  clearInterval(resendTimer);
  const tick = ()=>{ btn.textContent = left > 0 ? `Resend OTP (${left}s)` : 'Resend OTP'; if(left<=0){ clearInterval(resendTimer); btn.disabled=false; } left--; };
  tick(); resendTimer = setInterval(tick, 1000);
}

async function sendOtp(){
  const phone = $('#loginPhone').value.replace(/\D/g,'');
  if(phone.length !== 10){ showError('Enter a valid 10-digit mobile number.'); return; }
  clearError();
  const btn = $('#loginSubmit'); btn.disabled = true;
  try {
    const res = await api('/user/send-otp', { mobile_number: phone });
    pendingPhone = phone;
    pendingLoginId = res?.data?.login_id ?? null;
    step = 'otp'; paintStep(); startResendCooldown();
  } catch(e){ showError(e.message); }
  finally { btn.disabled = false; }
}

async function verifyOtp(){
  const otp = $('#loginOtp').value.trim();
  if(otp.length < 4){ showError('Enter the OTP you received.'); return; }
  clearError();
  const btn = $('#loginSubmit'); btn.disabled = true;
  try {
    const res = await api('/user/verify-otp', { mobile_number: pendingPhone, otp, login_id: pendingLoginId });
    const token = res.token;
    const user = res.data || {};
    if(!token) throw new Error('Login succeeded but no token was returned.');
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    closeLogin();
    paintAuthUI();
    toast(`Welcome${user.firstName ? ', ' + user.firstName : ''}!`);
  } catch(e){ showError(e.message); }
  finally { btn.disabled = false; }
}

export function openUserDrop(force){
  const drop = $('#userDrop');
  const open = force ?? drop.classList.contains('efm-hide');
  drop.classList.toggle('efm-hide', !open);
}
export function closeUserDrop(){ $('#userDrop').classList.add('efm-hide'); }

export function openLogin(){
  if(getToken()) return openUserDrop();
  step = 'phone'; pendingPhone=''; pendingLoginId=null; clearError();
  $('#loginPhone').value=''; $('#loginOtp').value='';
  paintStep();
  $('#loginSheet').classList.add('efm-on'); $('#scrim').classList.add('efm-on'); document.body.style.overflow='hidden';
}
export function closeLogin(){
  $('#loginSheet').classList.remove('efm-on');
  if(!$('#cart').classList.contains('efm-on') && !$('#sheet').classList.contains('efm-on')) $('#scrim').classList.remove('efm-on');
  document.body.style.overflow='';
  clearInterval(resendTimer);
}
export function isLoginOpen(){ return $('#loginSheet').classList.contains('efm-on'); }

function wireAvatar(img, user, name){
  if(!img) return;
  img.onerror = ()=>{ img.replaceWith(Object.assign(document.createElement('span'), { className:'efm-avatar efm-avatar-fallback', textContent:name.charAt(0).toUpperCase() })); };
  img.src = user.profilePitcher;
}

export async function logout(){
  const token = getToken();
  localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
  closeUserDrop();
  paintAuthUI();
  toast('Logged out');
  if(token){
    try { await fetch(`${API_BASE}/user/logout`, { method:'POST', headers:{ Authorization:`Bearer ${token}` } }); } catch {}
  }
}

export function paintAuthUI(){
  const user = getUser();
  const btn = $('#loginBtn');
  if(!getToken()){
    btn.classList.remove('efm-logged-in');
    btn.textContent = 'Login';
    closeUserDrop();
    return;
  }
  const name = user?.firstName || 'Account';
  const phone = (user?.mobile_number || '').replace(/\D/g,'');
  const phoneLabel = phone.length === 10 ? `+91 ${phone.slice(0,5)} ${phone.slice(5)}` : phone;
  const avatarHTML = user?.profilePitcher
    ? `<img class="efm-avatar" alt="">`
    : `<span class="efm-avatar efm-avatar-fallback">${name.charAt(0).toUpperCase()}</span>`;

  btn.classList.add('efm-logged-in');
  btn.innerHTML = `${avatarHTML}My Account`;
  wireAvatar(btn.querySelector('img.efm-avatar'), user, name);

  const head = $('#userDropHead');
  head.innerHTML = `${avatarHTML}<span class="efm-user-info"><b>${name}</b>${phoneLabel ? `<small>${phoneLabel}</small>` : ''}</span>`;
  wireAvatar(head.querySelector('img.efm-avatar'), user, name);
}

$('#loginBtn').onclick = openLogin;
$('#loginClose').onclick = closeLogin;
$('#loginEditPhone').onclick = ()=>{ step='phone'; clearError(); paintStep(); };
$('#loginResend').onclick = ()=>{ if(!$('#loginResend').disabled) sendOtp(); };
$('#loginSubmit').onclick = ()=> step==='phone' ? sendOtp() : verifyOtp();
$('#loginPhone').addEventListener('keydown', e=>{ if(e.key==='Enter') sendOtp(); });
$('#loginOtp').addEventListener('keydown', e=>{ if(e.key==='Enter') verifyOtp(); });
$('#logoutBtn').onclick = logout;
document.addEventListener('click', e=>{ if(!e.target.closest('#userMenu')) closeUserDrop(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeUserDrop(); });

paintAuthUI();
