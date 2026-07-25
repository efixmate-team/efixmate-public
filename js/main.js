import { renderHome } from './render.js';
import { renderHero } from './hero.js';
import { syncCards } from './cart.js';
import './sheet.js';
import './search.js';
import './auth.js';
import './events.js';

/* legal/support pages share this same header+footer+modals chrome but have
   no hero/tiles/rails — only bootstrap the homepage-only rendering when
   those containers actually exist on the page. */
if (document.getElementById('tiles')) {
  renderHero();
  renderHome();
}
syncCards();
document.getElementById('ftYear').textContent = new Date().getFullYear();
