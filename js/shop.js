document.getElementById('open-real-shop')?.addEventListener('click', () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink('https://example-growshop.com');
  } else {
    window.open('https://example-growshop.com', '_blank');
  }
});