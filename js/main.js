import { renderHome } from './render.js';
import { renderHero } from './hero.js';
import { syncCards } from './cart.js';
import './sheet.js';
import './search.js';
import './auth.js';
import './events.js';

renderHero();
renderHome();
syncCards();
document.getElementById('ftYear').textContent = new Date().getFullYear();
