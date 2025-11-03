export const EQUIPMENT = {
  autoWater: { name: "Автополив", desc: "Поливает растения автоматически", price: 2000 },
  hydroponics: { name: "Гидропоника", desc: "+20% к урожаю", price: 5000 },
  co2: { name: "CO₂-генератор", desc: "Ускоряет рост", price: 3000 },
  climateControl: { name: "Климат-контроль", desc: "Снижает риск болезней", price: 4000 }
};

export const CONSUMABLES = {
  fertilizer: { name: "Удобрение", desc: "Восстанавливает здоровье", price: 100 },
  antifungus: { name: "От грибка", desc: "Лечит грибковые заболевания", price: 150 },
  pesticide: { name: "От вредителей", desc: "Убивает вредителей", price: 150 },
  antivirus: { name: "Антивирус", desc: "Лечит вирусные инфекции", price: 200 },
  revival: { name: "Эликсир возрождения", desc: "Воскрешает мёртвое растение", price: 500 },
  superWater: { name: "Супер-вода", desc: "Полный полив + здоровье", price: 250 }
};

document.getElementById('open-real-shop')?.addEventListener('click', () => {
  const url = 'https://example-growshop.com';
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink(url);
  } else {
    window.open(url, '_blank');
  }
});
