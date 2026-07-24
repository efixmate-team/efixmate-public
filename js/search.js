import { P, C, S, CATS, rupee, minPrice, off } from './data.js';
import { $, esc, mark } from './utils.js';
import { cardHTML } from './render.js';
import { syncCards } from './cart.js';

/* ========== search page ========== */
const TRENDING = ['AC service','Bathroom cleaning','Electrician','Sofa cleaning','Pest control','RO service','Salon at home','Water tank'];
const RECENT = ['Bathroom cleaning','AC service','Geyser repair'];
const SP = {q:'', mode:'idle', sort:'rel', filters:new Set(), sel:-1, hits:[]};

function matches(q){
  const v = q.toLowerCase().trim(); if(!v) return [];
  const re = new RegExp('\\b' + v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'i');   // word-start match
  return S.map(s=>{
    const name = s[1].toLowerCase(), hay = s[2]+' '+s[10];
    const score = name.startsWith(v) ? 0 : re.test(s[1]) ? 1 : name.includes(v) ? 2 : re.test(hay) ? 3 : -1;
    return score<0 ? null : {s, score};
  }).filter(Boolean).sort((a,b)=>a.score-b.score || a.s[1].localeCompare(b.s[1])).map(x=>x.s);
}
function applyFilters(list){
  let out = list.filter(s=>{
    const f = SP.filters;
    if(f.has('fast') && !s[5].includes('MINS')) return false;
    if(f.has('cheap') && minPrice(s[0]) > 500) return false;
    if(f.has('top') && parseFloat(s[6]) < 4.8) return false;
    if(f.has('offer') && off(s[3],s[4]) < 35) return false;
    return true;
  });
  const key = {plow:s=>minPrice(s[0]), phigh:s=>-minPrice(s[0]), rating:s=>-parseFloat(s[6])}[SP.sort];
  if(key) out = out.slice().sort((a,b)=>key(a)-key(b));
  return out;
}

export function openSearch(prefill){
  SP.sel = -1;
  $('#searchPage').classList.add('on');
  document.body.style.overflow = 'hidden';
  $('#spQ').value = prefill || '';
  if(prefill){ runSearch(prefill, true); } else { SP.mode='idle'; SP.q=''; renderSP(); }
  $('#spClear').classList.toggle('hide', !prefill);
  setTimeout(()=>$('#spQ').focus(), 60);
}
export function closeSearch(){
  $('#searchPage').classList.remove('on');
  if(!$('#cart').classList.contains('on') && !$('#sheet').classList.contains('on')) document.body.style.overflow='';
  SP.mode='idle'; SP.filters.clear(); SP.sort='rel';
}
function onType(v){
  SP.q = v; SP.sel = -1;
  $('#spClear').classList.toggle('hide', !v);
  SP.mode = v.trim() ? 'suggest' : 'idle';
  renderSP();
}
function runSearch(term, skipRecent){
  const t = (term||'').trim(); if(!t) return;
  SP.q = t; SP.mode = 'results'; SP.sel = -1; SP.hits = matches(t);
  $('#spQ').value = t; $('#spClear').classList.remove('hide');
  if(!skipRecent){ const i = RECENT.findIndex(r=>r.toLowerCase()===t.toLowerCase());
    if(i>=0) RECENT.splice(i,1); RECENT.unshift(t); RECENT.length = Math.min(RECENT.length,8); }
  $('#spQ').blur(); renderSP();
}

function renderSP(){
  const box = $('#spContent'), F = $('#spFilters');
  F.classList.toggle('hide', SP.mode!=='results');
  $('.sp-body').scrollTop = 0;

  if(SP.mode==='idle'){
    box.innerHTML = `
      ${RECENT.length ? `<div class="sp-sec">
        <h4>Recent searches <button id="clrRecent">Clear all</button></h4>
        <div class="tags">${RECENT.map(r=>`<span class="tag" data-run="${esc(r)}">
          <svg class="ic"><use href="#clock"/></svg>${esc(r)}
          <button class="rm" data-rm="${esc(r)}" aria-label="Remove ${esc(r)}"><svg class="ic" style="width:10px;height:10px"><use href="#x"/></svg></button>
        </span>`).join('')}</div></div>` : ''}

      <div class="sp-sec"><h4>Trending in Bengaluru</h4>
        <div class="tags">${TRENDING.map(t=>`<button class="tag hot" data-run="${esc(t)}">${esc(t)}</button>`).join('')}</div></div>

      <div class="sp-sec"><h4>Browse by category</h4>
        <div class="tiles" style="grid-template-rows:1fr; padding-bottom:4px">
          ${CATS.map(([n,i,c])=>`<button class="tile" data-run="${esc(n)}">
            <div style="background:${P[c]}"><svg class="ic" style="color:${C[c]}"><use href="#${i}"/></svg></div><b>${n}</b>
          </button>`).join('')}</div></div>

      <div class="sp-sec"><h4>Popular right now</h4>
        <div class="grid">${['ac1','cl1','el1','pl1','sa1','ap1'].map(cardHTML).join('')}</div></div>`;
    syncCards(); return;
  }

  if(SP.mode==='suggest'){
    const hits = matches(SP.q);
    const cats = CATS.filter(c=>c[0].toLowerCase().includes(SP.q.toLowerCase().trim())).slice(0,3);
    box.innerHTML = !hits.length && !cats.length
      ? `<div class="empty"><svg class="ic"><use href="#search"/></svg>
          <b>Nothing matches “${esc(SP.q)}”</b>
          <div style="font-size:12px">Try a trade like “electrician”, or a problem like “leak”.</div></div>`
      : `<div class="sugs">
          ${cats.map(([n,i,c])=>`<button class="sug" data-run="${esc(n)}">
            <span class="th" style="background:${P[c]}"><svg class="ic" style="color:${C[c]}"><use href="#${i}"/></svg></span>
            <span class="tx"><b>${mark(n,SP.q)}</b><small>Category</small></span>
            <svg class="ic go"><use href="#chev-r"/></svg></button>`).join('')}
          ${hits.map(s=>`<button class="sug" data-run="${esc(s[1])}">
            <span class="th" style="background:${P[s[8]]}"><svg class="ic" style="color:${C[s[8]]}"><use href="#${s[7]}"/></svg></span>
            <span class="tx"><b>${mark(s[1],SP.q)}</b><small>${esc(s[2])} · ${s[5].toLowerCase()}</small></span>
            <span class="pv">from ${rupee(minPrice(s[0]))}</span></button>`).join('')}
        </div>`;
    return;
  }

  /* results */
  const list = applyFilters(SP.hits);
  document.querySelectorAll('#spFilters .fchip').forEach(c=>c.classList.toggle('on', SP.filters.has(c.dataset.f)));
  $('#spSort').value = SP.sort;
  box.innerHTML = list.length
    ? `<div class="res-meta"><b>${list.length} service${list.length!==1?'s':''}</b> for “${esc(SP.q)}”</div>
       <div class="grid">${list.map(s=>cardHTML(s[0])).join('')}</div>`
    : `<div class="empty"><svg class="ic"><use href="#search"/></svg>
        <b>No service matches those filters</b>
        <div style="font-size:12px; margin-bottom:14px">${SP.filters.size ? 'Try removing a filter.' : 'Try “AC”, “leak”, “cleaning” or “salon”.'}</div>
        <div class="tags" style="justify-content:center">${TRENDING.slice(0,4).map(t=>`<button class="tag hot" data-run="${esc(t)}">${esc(t)}</button>`).join('')}</div></div>`;
  syncCards();
}

/* search wiring */
$('#spQ').addEventListener('input', e=>onType(e.target.value));
$('#spQ').addEventListener('keydown', e=>{
  const rows = [...document.querySelectorAll('.sug')];
  if(e.key==='ArrowDown' || e.key==='ArrowUp'){
    if(!rows.length) return; e.preventDefault();
    SP.sel = e.key==='ArrowDown' ? (SP.sel+1)%rows.length : (SP.sel<=0 ? rows.length-1 : SP.sel-1);
    rows.forEach((r,i)=>r.classList.toggle('cur', i===SP.sel));
    rows[SP.sel].scrollIntoView({block:'nearest'});
  } else if(e.key==='Enter'){
    e.preventDefault();
    if(SP.sel>=0 && rows[SP.sel]) runSearch(rows[SP.sel].dataset.run);
    else runSearch(e.target.value);
  }
});
$('#spClear').onclick = ()=>{ $('#spQ').value=''; onType(''); $('#spQ').focus(); };
$('#spBack').onclick = ()=>{ if(SP.mode==='results'){ SP.mode = SP.q ? 'suggest' : 'idle'; SP.filters.clear(); renderSP(); $('#spQ').focus(); } else closeSearch(); };
$('#spSort').onchange = e=>{ SP.sort = e.target.value; renderSP(); };
$('#spFilters').addEventListener('click', e=>{ const c = e.target.closest('[data-f]'); if(!c) return;
  SP.filters.has(c.dataset.f) ? SP.filters.delete(c.dataset.f) : SP.filters.add(c.dataset.f); renderSP(); });
$('#spContent').addEventListener('click', e=>{
  const rm = e.target.closest('[data-rm]');
  if(rm){ e.stopPropagation(); const i=RECENT.indexOf(rm.dataset.rm); if(i>=0) RECENT.splice(i,1); renderSP(); return; }
  if(e.target.closest('#clrRecent')){ RECENT.length=0; renderSP(); return; }
  const r = e.target.closest('[data-run]');
  if(r && !e.target.closest('[data-open]')) runSearch(r.dataset.run);
});
