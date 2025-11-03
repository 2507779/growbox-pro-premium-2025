import { renderPlants } from './ui.js';
import { gameState } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  // Telegram WebApp
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();
    tg.disableVerticalSwipes();
    tg.setBackgroundColor('#ffffff');
    tg.setHeaderColor('#8bc34a');
  }

  // Авто-рост каждые 8 секунд
  setInterval(() => {
    gameState.plants.forEach(p => p.update());
    if (document.getElementById('garden-view').classList.contains('active')) {
      renderPlants();
    }
  }, 8000);

  // Обновить UI при старте
  import('./ui.js').then(ui => {
    ui.renderPlants();
    ui.renderShop();
    ui.renderInventory();
    ui.renderAchievements();
  });
});
