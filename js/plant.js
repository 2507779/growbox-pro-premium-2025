import { gameState, addXP } from './game.js';
import { showToast } from './ui.js';

export const SEEDS = {
  basic: { name: "Базовые", level: 1, growth: 24, yield: 20 },
  sativa: { name: "Sativa", level: 2, growth: 26, yield: 55 }
};

export class Plant {
  constructor(type) {
    const meta = SEEDS[type];
    this.id = Date.now() + Math.random();
    this.type = type;
    this.meta = meta;
    this.stage = 0;
    this.health = 100;
    this.isDead = false;
    this.plantedAt = Date.now();
    this.lastWatered = Date.now();
  }

  water() {
    if (this.isDead) return false;
    this.lastWatered = Date.now();
    this.health = Math.min(100, this.health + 15);
    addXP(2);
    return true;
  }

  harvest() {
    if (this.stage < 4 || this.isDead) return null;
    const income = this.meta.yield * (1 + (gameState.player.level - 1) * 0.1);
    gameState.player.money += income;
    addXP(20);
    return { income };
  }

  update() {
    if (this.isDead) return;
    const hours = (Date.now() - this.plantedAt) / (1000 * 60 * 60);
    this.stage = Math.min(4, Math.floor((hours / this.meta.growth) * 5));
    if (Date.now() - this.lastWatered > 12 * 60 * 60 * 1000) {
      this.health -= 1;
    }
    if (this.health <= 0) this.isDead = true;
  }
}

export function createPlant(type) {
  if (!gameState.inventory.seeds[type] || gameState.inventory.seeds[type] <= 0) return null;
  if (gameState.player.level < SEEDS[type].level) return null;
  gameState.inventory.seeds[type]--;
  const plant = new Plant(type);
  gameState.plants.push(plant);
  if (!gameState.achievements.firstPlant) {
    gameState.achievements.firstPlant = true;
    showToast("🌱 Первое растение посажено!", "success");
  }
  return plant;
}