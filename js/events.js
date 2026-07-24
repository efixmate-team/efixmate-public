import { $, toast } from './utils.js';
import { openSheet, closeSheet } from './sheet.js';
import { bump, bumpById, getLine, openCart, closeCart, confirmBooking, resetCart, selectDate, selectSlot } from './cart.js';
import { openSearch, closeSearch } from './search.js';

document.addEventListener('click', e=>{
  const t = e.target;
  const open = t.closest('[data-open]');
  if(open){ openSheet(open.dataset.open); return; }
  const ed = t.closest('[data-edit]'); if(ed){ openSheet(getLine(ed.dataset.edit).id, ed.dataset.edit); return; }

  const inc = t.closest('[data-inc]'), dec = t.closest('[data-dec]');
  if(inc) return bumpById(inc.dataset.inc, 1);
  if(dec) return bumpById(dec.dataset.dec, -1);
  const ki = t.closest('[data-k-inc]'), kd = t.closest('[data-k-dec]');
  if(ki) return bump(ki.dataset.kInc, 1);
  if(kd) return bump(kd.dataset.kDec, -1);

  const d=t.closest('[data-date]'); if(d){ selectDate(d.dataset.date); return; }
  const s=t.closest('[data-slot]'); if(s && !s.disabled){ selectSlot(s.dataset.slot); return; }
  if(t.closest('[data-searchopen]')) return openSearch('');
  const cat=t.closest('[data-cat]'); if(cat) return openSearch(cat.dataset.cat);
  const see=t.closest('[data-see]'); if(see) return openSearch(see.dataset.see);

  if(t.closest('#openCart')||t.closest('#cartBar')) return openCart();
  if(t.closest('#closeCart')) return closeCart();
  if(t.closest('#scrim')){ if($('#sheet').classList.contains('on')) return closeSheet(); return closeCart(); }
  if(t.closest('#confirm')) return confirmBooking();
  if(t.closest('#doneBtn')) return resetCart();
  if(t.closest('#shopBtn')) return closeCart();
  if(t.closest('#etaBox')) return toast('Delivering to HSR Layout, Bengaluru');
  const nb=t.closest('.h-nav button'); if(nb){ document.querySelectorAll('.h-nav button').forEach(b=>b.classList.remove('on')); nb.classList.add('on'); }
});
addEventListener('keydown', e=>{
  if(e.key==='/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)
     && !$('#searchPage').classList.contains('on')){ e.preventDefault(); return openSearch(''); }
  if(e.key!=='Escape') return;
  if($('#sheet').classList.contains('on')) return closeSheet();
  if($('#cart').classList.contains('on')) return closeCart();
  if($('#searchPage').classList.contains('on')) return closeSearch(); });

/* ========== theme + placeholder rotation ========== */
$('#theme').onclick = ()=>{ document.documentElement.dataset.theme = document.documentElement.dataset.theme==='dark'?'light':'dark'; };
if(matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.dataset.theme='dark';

const HINTS=['"AC service"','"leaking tap"','"deep cleaning"','"electrician"','"salon at home"','"pest control"']; let hi=0;
setInterval(()=>{ hi=(hi+1)%HINTS.length; ['q','qm'].forEach(id=>{const el=document.getElementById(id); if(el) el.placeholder='Search '+HINTS[hi];}); },2600);
