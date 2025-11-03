import { gameState } from './game.js';
import { createPlant, SEEDS } from './plant.js';

export function showToast(message, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = message;
  t.className = `toast ${type}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

export function renderPlants() {
  const container = document.getElementById('plants-container');
  const empty = document.getElementById('empty-garden');
  if (gameState.plants.length === 0) {
    empty.style.display = 'block';
    container.innerHTML = '';
    return;
  }
  empty.style.display = 'none';
  container.innerHTML = gameState.plants.map(p => `
    <div class="plant-card">
      <h3>${SEEDS[p.type].name}</h3>
      <div>Стадия: ${p.stage}/4</div>
      <div class="plant-stage-bar">
        <div class="plant-stage-progress" style="width: ${p.stage * 25}%"></div>
      </div>
      <div class="plant-health">
        <div class="plant-health-bar" style="width: ${p.health}%"></div>
      </div>
      <button onclick="window.actions.water(${p.id})">💧 Полить</button>
      ${p.stage === 4 ? `<button onclick="window.actions.harvest(${p.id})">✂️ Собрать</button>` : ''}
    </div>
  `).join('');
}

export function renderShop() {
  const container = document.getElementById('seeds-shop');
  container.innerHTML = Object.entries(SEEDS).map(([key, seed]) => `
    <div style="padding:12px; border-bottom:1px solid #eee">
      <strong>${seed.name}</strong> (ур. ${seed.level})<br>
      Урожай: ${seed.yield}<br>
      <button onclick="window.shop.buy('${key}')">Купить за ${seed.yield * 2} ₽</button>
    </div>
  `).join('');
}

// Глобальные действия для кнопок
window.actions = {
  water(id) {
    const plant = gameState.plants.find(p => p.id == id);
    if (plant && plant.water()) {
      showToast("💧 Растение полито!", "success");
      renderPlants();
    }
  },
  harvest(id) {
    const plant = gameState.plants.find(p => p.id == id);
    if (plant) {
      const res = plant.harvest();
      if (res) {
        showToast(`✅ Урожай собран! +${Math.round(res.income)} ₽`, "success");
        if (!gameState.achievements.firstHarvest) {
          gameState.achievements.firstHarvest = true;
        }
        renderPlants();
      }
    }
  }
};

window.shop = {
  buy(type) {
    const seed = SEEDS[type];
    const price = seed.yield * 2;
    if (gameState.player.money >= price) {
      gameState.player.money -= price;
      gameState.inventory.seeds[type] = (gameState.inventory.seeds[type] || 0) + 1;
      showToast(`✅ Куплены семена: ${seed.name}`, "success");
    } else {
      showToast("❌ Недостаточно денег", "error");
    }
  }
};

// Навигация
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const view = e.currentTarget.dataset.view;
    document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`${view}-view`).classList.add('active');
    e.currentTarget.classList.add('active');
    
    if (view === 'garden') renderPlants();
    if (view === 'shop') renderShop();
  });
});