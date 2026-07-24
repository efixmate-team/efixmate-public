import { P, C, byId, priceOf, typeOf, unitOf, rupee, qtyText } from './data.js';
import { $, toast } from './utils.js';

/* ========== cart: key = id|type|unit ========== */
const cart = {};                 // key -> {id,t,u,q}
const active = {};               // id -> key (last touched)
let booked = false;

const lines = () => Object.values(cart);
const count = () => lines().reduce((a, l) => a + 1, 0);
const units = () => lines().reduce((a, l) => a + l.q, 0);
const subtotal = () => lines().reduce((a, l) => a + priceOf(l.id, l.t, l.u) * l.q, 0);
const mrpTotal = () => lines().reduce((a, l) => { const s = byId[l.id]; return a + priceOf(l.id, l.t, l.u) * (s[4] / s[3]) * l.q; }, 0);
function bill() {
  const sub = subtotal(), fee = sub ? 29 : 0, tax = Math.round(sub * .18), disc = Math.round(sub * .20);
  return { sub, fee, tax, disc, total: sub + fee + tax - disc };
}

export function syncCards() {
  document.querySelectorAll('[data-card]').forEach(card => {
    const id = card.dataset.card;
    const keys = Object.keys(cart).filter(k => k.startsWith(id + '|'));
    card.classList.toggle('in', keys.length > 0);
    const pick = card.querySelector('[data-picked]');
    if (!keys.length) { pick.classList.add('hide'); return; }
    const key = active[id] && cart[active[id]] ? active[id] : keys[0];
    active[id] = key;
    const l = cart[key];
    card.querySelector('[data-qty]').textContent = l.q;
    pick.classList.remove('hide');
    pick.querySelector('span').textContent = keys.length > 1
      ? `${keys.length} variants added · edit`
      : `${typeOf(l.id, l.t)[1]} · ${unitOf(l.id, l.u)[1]}`;
  });
  const n = count(), t = subtotal();
  $('#cartLabel').innerHTML = n ? `${n} item${n > 1 ? 's' : ''} <small>${rupee(t)}</small>` : 'My Cart';
  $('#cartBar').classList.toggle('on', n > 0 && !$('#cart').classList.contains('on'));
  $('#barLeft').innerHTML = `${n} item${n > 1 ? 's' : ''} · ${units()} unit${units() > 1 ? 's' : ''}<small>${rupee(t)} + taxes</small>`;
}
function refreshCart() { if ($('#cart').classList.contains('on')) drawCart(); }

export function bump(key, delta) {
  const l = cart[key]; if (!l) return;
  const stepBy = unitOf(l.id, l.u)[4];
  const q = l.q + delta * stepBy;
  if (q <= 0) delete cart[key]; else l.q = q;
  booked = false; syncCards(); refreshCart();
}
export function bumpById(id, delta) { bump(active[id], delta); }
export function getLine(key) { return cart[key]; }

export function addToCart(id, t, u, qty, editKey) {
  if (editKey) delete cart[editKey];
  const key = `${id}|${t}|${u}`;
  cart[key] = { id, t, u, q: (cart[key] && !editKey ? cart[key].q + qty : qty) };
  active[id] = key;
  booked = false;
  syncCards(); refreshCart();
  return key;
}

/* ========== cart drawer ========== */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i);
  return { k: `${i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`, top: i === 0 ? 'Today' : i === 1 ? 'Tom' : DAYS[d.getDay()], num: d.getDate() };
});
let dateSel = DATES[0].k, slotSel = '4:00 – 6:00 PM';
const SLOTS = ['8:00 – 10:00 AM', '10:00 AM – 12:00 PM', '12:00 – 2:00 PM', '2:00 – 4:00 PM', '4:00 – 6:00 PM', '6:00 – 8:00 PM'];

export function selectDate(k) { dateSel = k; drawCart(); }
export function selectSlot(s) { slotSel = s; drawCart(); }

function drawCart() {
  const body = $('#cartBody'), foot = $('#cartFoot');
  if (booked) {
    body.innerHTML = `<div class="done"><div class="tick"><svg class="ic"><use href="#check"/></svg></div>
      <b>Booking confirmed</b><p>EFM-${Math.floor(100000 + Math.random() * 899999)} · ${dateSel}, ${slotSel}<br/>We're assigning a verified professional now.</p>
      <div class="c-box" style="text-align:left"><div class="addr"><svg class="ic"><use href="#pin"/></svg>
      <span>402, Lake View Apartments<br/>HSR Layout Sector 2, Bengaluru 560102</span></div></div></div>`;
    foot.innerHTML = `<button class="pay" id="doneBtn"><span>Track booking</span><svg class="ic"><use href="#chev-r"/></svg></button>`;
    return;
  }
  if (!count()) {
    body.innerHTML = `<div class="c-empty"><svg class="ic"><use href="#bag"/></svg>
      <div style="font-weight:600; color:var(--ink)">Nothing booked yet</div>
      <div style="font-size:12px; margin-top:4px">Pick a service, its booking type and unit to start.</div></div>`;
    foot.innerHTML = `<button class="pay" id="shopBtn" style="background:var(--bg-2); color:var(--ink); border:1px solid var(--line-2)">
      <span>Browse services</span><svg class="ic"><use href="#chev-r"/></svg></button>`;
    return;
  }
  const b = bill(), saved = Math.round(mrpTotal() - subtotal()) + b.disc;
  body.innerHTML = `
    <div class="c-box"><b>${count()} item${count() > 1 ? 's' : ''} · ${units()} unit${units() > 1 ? 's' : ''}</b>
    ${Object.entries(cart).map(([key, l]) => {
    const s = byId[l.id], p = priceOf(l.id, l.t, l.u);
    return `<div class="c-item">
        <span class="th" style="background:${P[s[8]]}"><svg class="ic" style="color:${C[s[8]]}"><use href="#${s[7]}"/></svg></span>
        <span class="nm"><b>${s[1]}</b>
          <button class="vr" data-edit="${key}"><svg class="ic"><use href="#edit"/></svg>${typeOf(l.id, l.t)[1]} · ${unitOf(l.id, l.u)[1]}</button>
          <div style="font-size:10.5px; color:var(--gray); margin-top:3px">${rupee(p)} × ${qtyText(l.id, l.u, l.q)}</div>
        </span>
        <span class="rt">
          <span class="step">
            <button data-k-dec="${key}" aria-label="Decrease"><svg class="ic"><use href="#minus"/></svg></button>
            <span>${l.q}</span>
            <button data-k-inc="${key}" aria-label="Increase"><svg class="ic"><use href="#plus"/></svg></button>
          </span>
          <span class="pp">${rupee(p * l.q)}</span>
        </span></div>`;
  }).join('')}</div>

    <div class="c-box"><b>Slot</b>
      <div class="chips">${DATES.map(d => `<button class="chip ${d.k === dateSel ? 'on' : ''}" data-date="${d.k}">${d.top}<small>${d.num}</small></button>`).join('')}</div>
      <div class="slot-grid">${SLOTS.map((s, i) => `<button class="chip ${s === slotSel ? 'on' : ''}" data-slot="${s}" ${i ? '' : 'disabled'}>${s}</button>`).join('')}</div>
    </div>

    <div class="c-box"><b>Address</b>
      <div class="addr"><svg class="ic"><use href="#pin"/></svg>
        <span>402, Lake View Apartments<br/>HSR Layout Sector 2, Bengaluru 560102</span>
        <button class="see" style="margin-left:auto">Change</button></div></div>

    <div class="c-box"><b>Bill</b>
      <div class="bill">
        <div><span>Services (${units()} units)</span><b>${rupee(b.sub)}</b></div>
        <div><span>Visiting charge</span><b style="color:var(--green)">Free</b></div>
        <div><span>Platform fee</span><b>${rupee(b.fee)}</b></div>
        <div><span>Taxes (18% GST)</span><b>${rupee(b.tax)}</b></div>
        <div><span>WELCOME20</span><b style="color:var(--green)">− ${rupee(b.disc)}</b></div>
        <div class="tot"><span>To pay after service</span><b>${rupee(b.total)}</b></div>
      </div>
      <div style="margin-top:10px; background:var(--green-t); color:var(--green); font-size:11.5px; font-weight:600; padding:7px 9px; border-radius:6px">
        You save ${rupee(saved)} on this booking</div>
    </div>`;
  foot.innerHTML = `<button class="pay" id="confirm">
    <span>${rupee(b.total)} <small style="font-weight:500; opacity:.85">· pay after service</small></span>
    <span class="row" style="gap:6px">Confirm booking <svg class="ic"><use href="#chev-r"/></svg></span></button>`;
}

export function openCart() { booked = false; drawCart(); $('#cart').classList.add('on'); $('#scrim').classList.add('on'); document.body.style.overflow = 'hidden'; syncCards(); }
export function closeCart() { $('#cart').classList.remove('on'); $('#scrim').classList.remove('on'); document.body.style.overflow = ''; syncCards(); }

export function confirmBooking() { booked = true; drawCart(); toast('Booking confirmed'); }
export function resetCart() { Object.keys(cart).forEach(k => delete cart[k]); booked = false; closeCart(); syncCards(); }
