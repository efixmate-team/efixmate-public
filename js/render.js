import { P, C, byId, CATS, RAILS, BANNERS, rupee, minPrice, off } from './data.js';
import { $ } from './utils.js';

export function cardHTML(id){
  const [i,n,m,base,mrp,eta,r,ic,c] = byId[id];
  const from = minPrice(id);
  return `<article class="card" data-card="${i}">
    <div class="thumb" style="background:${P[c]}">
      <span class="badge-eta">${eta}</span><span class="badge-off">${off(base,mrp)}% OFF</span>
      <svg class="ic" style="color:${C[c]}"><use href="#${ic}"/></svg>
    </div>
    <h3>${n}</h3>
    <div class="meta">${m}</div>
    <div class="rate"><svg class="ic"><use href="#star"/></svg>${r}</div>
    <div class="bot">
      <span class="pr"><span class="from">from</span><b>${rupee(from)}</b></span>
      <button class="add" data-open="${i}">ADD</button>
      <span class="step-wrap"><span class="step">
        <button data-dec="${i}" aria-label="Decrease"><svg class="ic"><use href="#minus"/></svg></button>
        <span data-qty="${i}">1</span>
        <button data-inc="${i}" aria-label="Increase"><svg class="ic"><use href="#plus"/></svg></button>
      </span></span>
    </div>
    <button class="picked hide" data-picked="${i}" data-open="${i}">
      <svg class="ic"><use href="#edit"/></svg><span></span>
    </button>
  </article>`;
}

export function renderHome(){
  $('#navStrip').innerHTML = ['All','Repairs','Cleaning','Appliances','Salon','Packages','Offers'].map((n,i)=>`<button class="${i?'':'on'}">${n}</button>`).join('');
  $('#tiles').innerHTML = CATS.map(([n,i,c])=>`<button class="tile" data-cat="${n}">
    <div style="background:${P[c]}"><svg class="ic" style="color:${C[c]}"><use href="#${i}"/></svg></div><b>${n}</b></button>`).join('');
  $('#banners').innerHTML = BANNERS.map(([t,s,tag,bg])=>`<div class="ban" style="background:${bg}"><b>${t}</b><span>${s}</span><em>${tag}</em></div>`).join('');
  $('#rails').innerHTML = RAILS.map(([t,s,ids])=>`<section class="sec">
    <div class="sec-head"><div><h2>${t}</h2><p>${s}</p></div>
    <button class="see" data-see="${t.split('—')[0].trim()}">see all <svg class="ic" style="width:11px;height:11px;vertical-align:-1px"><use href="#chev-r"/></svg></button></div>
    <div class="rail">${ids.map(cardHTML).join('')}</div></section>`).join('');
  $('#seoLinks').innerHTML = (()=>{const cities=['Bengaluru','Mumbai','Delhi NCR','Hyderabad','Pune','Chennai'];
    const svc=['AC service','Electrician','Plumber','Deep cleaning','Carpenter','Pest control','Salon at home','RO service'];
    return svc.flatMap(s=>cities.map(c=>`<a href="#">${s} in ${c}</a>`)).join(' · ');})();
}
