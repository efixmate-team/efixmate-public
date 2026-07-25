import { $ } from './utils.js';

/* ========== home hero carousel ========== */
const HERO = [
  { img:'assets/hero/ac-service.webp', bg:'#EAF1FF', tag:'Limited time', title:'AC service & repair from ₹599', sub:'Certified technicians, reaches in 60 minutes', cta:'Book AC service' },
  { img:'assets/hero/cleaning.webp', bg:'#EAF6E6', tag:'Most booked', title:'Deep cleaning for your whole home', sub:'Crew of 4, professional equipment, done in a day', cta:'Book cleaning' },
  { img:'assets/hero/welcome.webp', bg:'#F6F1E9', tag:'New user offer', title:'20% off your first booking', sub:'Auto-applied at checkout with code WELCOME20', cta:'Explore services' },
];

let idx = 0, timer = null;

function paint(){
  $('#heroTrack').style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.efm-hero-dot').forEach((d,i)=>d.classList.toggle('efm-on', i===idx));
}
function go(i){ idx = (i + HERO.length) % HERO.length; paint(); restart(); }
function restart(){ clearInterval(timer); timer = setInterval(()=>go(idx+1), 5500); }

export function renderHero(){
  $('#heroTrack').innerHTML = HERO.map(h=>`<div class="efm-hero-slide" style="background:${h.bg}">
    <div class="efm-hero-text">
      <span class="efm-hero-tag">${h.tag}</span>
      <h2>${h.title}</h2>
      <p>${h.sub}</p>
      <button class="efm-hero-cta" data-searchopen>${h.cta} <svg class="efm-ic"><use href="#arr-ur"/></svg></button>
    </div>
    <img class="efm-hero-img" src="${h.img}" alt="" loading="lazy">
  </div>`).join('');
  $('#heroDots').innerHTML = HERO.map((_,i)=>`<button class="efm-hero-dot ${i?'':'efm-on'}" data-dot="${i}" aria-label="Go to slide ${i+1}"></button>`).join('');

  $('#heroPrev').onclick = ()=>go(idx-1);
  $('#heroNext').onclick = ()=>go(idx+1);
  $('#heroDots').addEventListener('click', e=>{ const d=e.target.closest('[data-dot]'); if(d) go(+d.dataset.dot); });
  $('#hero').addEventListener('mouseenter', ()=>clearInterval(timer));
  $('#hero').addEventListener('mouseleave', restart);

  paint();
  restart();
}
