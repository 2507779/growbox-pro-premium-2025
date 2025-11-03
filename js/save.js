import { gameState } from './game.js';

export function saveGame() {
  localStorage.setItem('growbox_save_2025_ultra', JSON.stringify(gameState));
}

export function loadGame() {
  const data = localStorage.getItem('growbox_save_2025_ultra');
  if (data) {
    try {
      const saved = JSON.parse(data);
      Object.assign(gameState, saved);
    } catch (e) {
      console.error('Ошибка загрузки сохранения');
    }
  }
}

loadGame();
setInterval(saveGame, 120000);
window.addEventListener('beforeunload', saveGame);
