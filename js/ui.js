import { gameState } from './game.js';
import { SEEDS, createPlant } from './plant.js';
import { EQUIPMENT, CONSUMABLES } from './shop.js';

export function showToast(message, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = message;
  t.className = `toast ${type}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function formatNumber(n) {
  return n.toLocaleString('ru-RU');
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
  container.innerHTML = gameState.plants.map(p => {
    const meta = SEEDS[p.type];
    return `
      <div class="card plant-card">
        <h3>${meta.name}</h3>
        <p>Стадия: ${p.stage}/4</p>
        <div class="plant-stage-bar">
          <div class="plant-stage-progress" style="width: ${p.stage * 25}%"></div>
        </div>
        <p>Здоровье: ${Math.round(p.health)}%</p>
        <div class="plant-health">
          <div class="plant-health-bar" style="width: ${p.health}%"></div>
        </div>
        <button class="btn btn-outline" onclick="window.actions.water(${p.id})">💧 Полить</button>
        <button class="btn btn-outline" onclick="window.actions.fertilize(${p.id})">🧪 Удобрить</button>
        ${p.stage === 4 ? `<button class="btn btn-green" onclick="window.actions.harvest(${p.id})">✂️ Собрать</button>` : ''}
        ${p.isDead ? `<button class="btn btn-red" onclick="window.actions.remove(${p.id})">🗑️ Удалить</button>` : ''}
      </div>
    `;
  }).join('');
}

export function renderShop() {
  // Семена
  let seedsHTML = '';
  for (const [key, seed] of Object.entries(SEEDS)) {
    const price = seed.yield * 10;
    seedsHTML += `
      <div class="card">
        <h3>${seed.name}</h3>
        <p>Уровень: ${seed.level}</p>
        <p>Урожай: ${seed.yield}</p>
        <p>Цена: ${formatNumber(price)} ₽</p>
        <button class="btn btn-primary" onclick="window.shop.buySeed('${key}')">Купить</button>
      </div>
    `;
  }
  document.getElementById('seeds-shop').innerHTML = seedsHTML;

  // Оборудование
  let equipHTML = '';
  for (const [key, item] of Object.entries(EQUIPMENT)) {
    if (!gameState.equipment[key]) {
      equipHTML += `
        <div class="card">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <p>Цена: ${formatNumber(item.price)} ₽</p>
          <button class="btn btn-primary" onclick="window.shop.buyEquipment('${key}')">Купить</button>
        </div>
      `;
    }
  }
  document.getElementById('equipment-shop').innerHTML = equipHTML || '<p>Всё оборудование куплено!</p>';

  // Расходники
  let consHTML = '';
  for (const [key, item] of Object.entries(CONSUMABLES)) {
    consHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <p>Цена: ${formatNumber(item.price)} ₽</p>
        <button class="btn btn-primary" onclick="window.shop.buyConsumable('${key}')">Купить</button>
      </div>
    `;
  }
  document.getElementById('consumables-shop').innerHTML = consHTML;
}

export function renderInventory() {
  let html = '<h3>Семена:</h3>';
  for (const [type, count] of Object.entries(gameState.inventory.seeds)) {
    if (count > 0) {
      html += `<p>${SEEDS[type].name}: ${count} шт. <button class="btn btn-outline" onclick="window.inventory.plant('${type}')">Посадить</button></p>`;
    }
  }
  html += '<h3>Расходники:</h3>';
  for (const [type, count] of Object.entries(gameState.inventory.consumables)) {
    if (count > 0) {
      html += `<p>${CONSUMABLES[type].name}: ${count} шт.</p>`;
    }
  }
  document.getElementById('inventory-list').innerHTML = html;
}

export function renderAchievements() {
  const list = [
    { id: 'firstPlant', name: "Первое растение", done: gameState.achievements.firstPlant },
    { id: 'firstHarvest', name: "Первый урожай", done: gameState.achievements.firstHarvest },
    { id: 'level5', name: "Опытный гровер (ур.5)", done: gameState.achievements.level5 },
    { id: 'tenHarvests', name: "Урожайный (10 растений)", done: gameState.achievements.tenHarvests },
    { id: 'fiveCured', name: "Выживший (5 вылечено)", done: gameState.achievements.fiveCured }
  ];
  document.getElementById('achievements-list').innerHTML = list.map(a => `
    <div class="card">
      <h3>${a.name} ${a.done ? '✅' : '🔒'}</h3>
      <p>${a.done ? 'Выполнено!' : 'В процессе...'}</p>
    </div>
  `).join('');
}

// Глобальные действия
window.actions = {
  water(id) {
    const plant = gameState.plants.find(p => p.id == id);
    if (plant && plant.water()) {
      showToast("💧 Растение полито!", "success");
      renderPlants();
    }
  },
  fertilize(id) {
    const plant = gameState.plants.find(p => p.id == id);
    if (plant && plant.fertilize()) {
      showToast("🧪 Удобрение применено!", "success");
      renderPlants();
    }
  },
  harvest(id) {
    const plant = gameState.plants.find(p => p.id == id);
    if (plant) {
      const res = plant.harvest();
      if (res) {
        showToast(`✅ Урожай собран! +${formatNumber(res.income)} ₽`, "success");
        renderPlants();
      }
    }
  },
  remove(id) {
    gameState.plants = gameState.plants.filter(p => p.id != id);
    renderPlants();
  }
};

window.inventory = {
  plant(type) {
    const plant = createPlant(type);
    if (plant) {
      renderPlants();
      renderInventory();
    } else {
      showToast("Нельзя посадить сейчас", "error");
    }
  }
};

window.shop = {
  buySeed(type) {
    const seed = SEEDS[type];
    const price = seed.yield * 10;
    if (gameState.player.money >= price) {
      gameState.player.money -= price;
      gameState.inventory.seeds[type] = (gameState.inventory.seeds[type] || 0) + 1;
      showToast(`✅ Куплены семена: ${seed.name}`, "success");
      renderInventory();
    } else {
      showToast("❌ Недостаточно денег", "error");
    }
  },
  buyEquipment(key) {
    const item = EQUIPMENT[key];
    if (gameState.player.money >= item.price) {
      gameState.player.money -= item.price;
      gameState.equipment[key] = true;
      showToast(`✅ Куплено: ${item.name}`, "success");
      renderShop();
    } else {
      showToast("❌ Недостаточно денег", "error");
    }
  },
  buyConsumable(key) {
    const item = CONSUMABLES[key];
    if (gameState.player.money >= item.price) {
      gameState.player.money -= item.price;
      gameState.inventory.consumables[key] = (gameState.inventory.consumables[key] || 0) + 1;
      showToast(`✅ Куплено: ${item.name}`, "success");
      renderInventory();
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
    if (view === 'inventory') renderInventory();
    if (view === 'achievements') renderAchievements();
  });
});
