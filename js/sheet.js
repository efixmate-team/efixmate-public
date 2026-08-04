import { P, C, byId, fam, typeOf, unitOf, priceOf, qtyText, rupee } from './data.js';
import { $, toast } from './utils.js';
import { addToCart, getLine } from './cart.js';

/* ========== variant sheet: booking type -> unit -> count ========== */
let sh = {id:null, t:null, u:null, q:1, editKey:null};

export function openSheet(id, editKey){
  const [i,n,m,base,mrp,eta,r,ic,c] = byId[id];
  const img = byId[id][11];
  sh = {id, t:null, u:null, q:1, editKey:editKey||null};
  const editLine = editKey ? getLine(editKey) : null;
  if(editLine){ sh.t=editLine.t; sh.u=editLine.u; sh.q=editLine.q; }
  $('#shThumb').style.background = img ? '' : P[c];
  $('#shThumb').innerHTML = img
    ? `<img class="efm-thumb-img" src="${img}" alt="${n}">`
    : `<svg class="efm-ic" style="color:${C[c]}"><use href="#${ic}"/></svg>`;
  $('#shName').textContent = n;
  $('#shMeta').textContent = `${m} · ${eta.toLowerCase()} · ★ ${r}`;
  const f = fam(id);
  $('#shTypes').innerHTML = f.types.map(t=>`<button class="efm-opt ${sh.t===t[0]?'efm-on':''}" data-t="${t[0]}">${t[1]}</button>`).join('');
  $('#shUnits').innerHTML = f.units.map(u=>`<button class="efm-opt ${sh.u===u[0]?'efm-on':''}" data-u="${u[0]}">${u[1]}<small>per ${u[2]}</small></button>`).join('');
  paintSheet();
  $('#sheet').classList.add('efm-on'); $('#scrim').classList.add('efm-on'); document.body.style.overflow='hidden';
}
export function closeSheet(){ $('#sheet').classList.remove('efm-on');
  if(!$('#cart').classList.contains('efm-on')){ $('#scrim').classList.remove('efm-on');
    if(!$('#searchPage').classList.contains('efm-on')) document.body.style.overflow=''; } }
function paintSheet(){
  const ready = sh.t && sh.u;
  $('#shQtyRow').classList.toggle('efm-off', !ready);
  $('#shAdd').disabled = !ready;
  if(!ready){
    $('#shUnitPrice').textContent = '—';
    $('#shUnitLabel').textContent = 'Select booking type and unit first';
    $('#shHint').querySelector('span').textContent = !sh.t ? 'Pick a booking type to continue.' : 'Now pick the unit this applies to.';
    $('#shCtaL').textContent = 'Add to booking'; $('#shCtaR').textContent='';
    return;
  }
  const s = byId[sh.id], p = priceOf(sh.id,sh.t,sh.u), unit = unitOf(sh.id,sh.u);
  const mrpEach = Math.round(p * (s[4]/s[3]));
  if(sh.q < unit[4]) sh.q = unit[4];
  $('#qVal').textContent = sh.q;
  $('#shUnitPrice').innerHTML = `${rupee(p)} <s style="color:var(--gray-2); font-weight:500; font-size:11px">${rupee(mrpEach)}</s>`;
  $('#shUnitLabel').textContent = `per ${unit[2]} · ${typeOf(sh.id,sh.t)[1].toLowerCase()}`;
  $('#shHint').querySelector('span').textContent = `${typeOf(sh.id,sh.t)[1]} · ${unit[1]} · ${qtyText(sh.id,sh.u,sh.q)}`;
  $('#shCtaL').textContent = sh.editKey ? 'Update booking' : 'Add to booking';
  $('#shCtaR').innerHTML = `${rupee(p*sh.q)}<s>${rupee(mrpEach*sh.q)}</s>`;
}
$('#shTypes').addEventListener('click', e=>{ const b=e.target.closest('[data-t]'); if(!b) return;
  sh.t=b.dataset.t; [...$('#shTypes').children].forEach(x=>x.classList.toggle('efm-on', x===b)); paintSheet(); });
$('#shUnits').addEventListener('click', e=>{ const b=e.target.closest('[data-u]'); if(!b) return;
  sh.u=b.dataset.u; sh.q = unitOf(sh.id,sh.u)[4]; [...$('#shUnits').children].forEach(x=>x.classList.toggle('efm-on', x===b)); paintSheet(); });
$('#qInc').onclick = ()=>{ sh.q += unitOf(sh.id,sh.u)[4]; paintSheet(); };
$('#qDec').onclick = ()=>{ const st=unitOf(sh.id,sh.u)[4]; sh.q = Math.max(st, sh.q-st); paintSheet(); };
$('#shClose').onclick = closeSheet;
$('#shAdd').onclick = ()=>{
  if(!sh.t || !sh.u) return;
  addToCart(sh.id, sh.t, sh.u, sh.q, sh.editKey);
  closeSheet();
  toast(`${byId[sh.id][1]} · ${typeOf(sh.id,sh.t)[1]} added`);
};
