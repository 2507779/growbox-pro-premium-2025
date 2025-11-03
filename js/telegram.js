document.addEventListener('DOMContentLoaded', () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();
    tg.disableVerticalSwipes();
    tg.setBackgroundColor('#ffffff');
    tg.setHeaderColor('#8bc34a');
  }

  // Имитация роста раз в 10 сек (для демо)
  setInterval(() => {
    gameState.plants.forEach(p => p.update());
    if (document.getElementById('garden-view').classList.contains('active')) {
      import('./ui.js').then(ui => ui.renderPlants());
    }
  }, 10000);
});