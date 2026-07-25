import { P, C, byId, CATS, RAILS, BANNERS, rupee, minPrice, off } from './data.js';
import { $ } from './utils.js';

export function cardHTML(id){
  const [i,n,m,base,mrp,eta,r,ic,c] = byId[id];
  const from = minPrice(id);
  return `<article class="efm-card" data-card="${i}">
    <div class="efm-thumb" style="background:${P[c]}">
      <span class="efm-badge-eta">${eta}</span><span class="efm-badge-off">${off(base,mrp)}% OFF</span>
      <svg class="efm-ic" style="color:${C[c]}"><use href="#${ic}"/></svg>
    </div>
    <h3>${n}</h3>
    <div class="efm-meta">${m}</div>
    <div class="efm-rate"><svg class="efm-ic"><use href="#star"/></svg>${r}</div>
    <div class="efm-bot">
      <span class="efm-pr"><span class="efm-from">from</span><b>${rupee(from)}</b></span>
      <button class="efm-add" data-open="${i}">ADD</button>
      <span class="efm-step-wrap"><span class="efm-step">
        <button data-dec="${i}" aria-label="Decrease"><svg class="efm-ic"><use href="#minus"/></svg></button>
        <span data-qty="${i}">1</span>
        <button data-inc="${i}" aria-label="Increase"><svg class="efm-ic"><use href="#plus"/></svg></button>
      </span></span>
    </div>
    <button class="efm-picked efm-hide" data-picked="${i}" data-open="${i}">
      <svg class="efm-ic"><use href="#edit"/></svg><span></span>
    </button>
  </article>`;
}

export function renderHome(){
  $('#navStrip').innerHTML = ['All','Repairs','Cleaning','Appliances','Salon','Packages','Offers'].map((n,i)=>`<button class="${i?'':'efm-on'}">${n}</button>`).join('');
  $('#tiles').innerHTML = CATS.map(([n,i,c])=>`<button class="efm-tile" data-cat="${n}">
    <div style="background:${P[c]}"><svg class="efm-ic" style="color:${C[c]}"><use href="#${i}"/></svg></div><b>${n}</b></button>`).join('');
  $('#banners').innerHTML = BANNERS.map(([t,s,tag,bg])=>`<div class="efm-ban" style="background:${bg}"><b>${t}</b><span>${s}</span><em>${tag}</em></div>`).join('');
  $('#rails').innerHTML = RAILS.map(([t,s,ids])=>`<section class="efm-sec">
    <div class="efm-sec-head"><div><h2>${t}</h2><p>${s}</p></div>
    <button class="efm-see" data-see="${t.split('—')[0].trim()}">see all <svg class="efm-ic" style="width:11px;height:11px;vertical-align:-1px"><use href="#chev-r"/></svg></button></div>
    <div class="efm-rail">${ids.map(cardHTML).join('')}</div></section>`).join('');
  $('#seoLinks').innerHTML = (()=>{const cities=['Bengaluru','Mumbai','Delhi NCR','Hyderabad','Pune','Chennai'];
    const svc=['AC service','Electrician','Plumber','Deep cleaning','Carpenter','Pest control','Salon at home','RO service'];
    return svc.flatMap(s=>cities.map(c=>`<a href="#">${s} in ${c}</a>`)).join(' · ');})();
}
