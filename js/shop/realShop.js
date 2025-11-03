export const REAL_PRODUCTS = [
  { name: "LED лампа 300W", img: "assets/equipment/led.jpg", price: "8 990 ₽" },
  { name: "Гроутент 80x80x160 см", img: "assets/equipment/tent.jpg", price: "6 500 ₽" },
  { name: "Вытяжной вентилятор", img: "assets/equipment/fan.jpg", price: "3 200 ₽" },
  { name: "Угольный фильтр", img: "assets/equipment/filter.jpg", price: "4 100 ₽" }
];

export function renderRealShop() {
  const container = document.getElementById('real-products');
  container.innerHTML = REAL_PRODUCTS.map(p => `
    <div class="product-card">
      <img src="${p.img}" class="product-img" alt="${p.name}">
      <div class="product-name">${p.name}</div>
      <div class="product-price">${p.price}</div>
    </div>
  `).join('');
}

document.getElementById('open-real-shop')?.addEventListener('click', () => {
  const url = 'https://growshop.example.com'; // ← ЗАМЕНИТЕ НА СВОЙ!
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink(url);
  } else {
    window.open(url, '_blank');
  }
});
