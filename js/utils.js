export const $ = s => document.querySelector(s);

export const esc = t => t.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

export const mark = (text,q)=>{ const i = text.toLowerCase().indexOf(q.toLowerCase());
  return i<0 ? esc(text) : esc(text.slice(0,i))+'<em>'+esc(text.slice(i,i+q.length))+'</em>'+esc(text.slice(i+q.length)); };

export function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('efm-on'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('efm-on'),1900); }
