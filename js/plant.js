import { gameState, addXP } from './game.js';
import { showToast } from './ui.js';

export const SEEDS = {
  basic: { name: "Базовые", level: 1, growth: 24, yield: 20, color: "#4caf50" },
  improved: { name: "Улучшенные", level: 2, growth: 20, yield: 35, color: "#8bc34a" },
  elite: { name: "Элитные", level: 3, growth: 18, yield: 60, color: "#cddc39" },
  legendary: { name: "Легендарные", level: 5, growth: 16, yield: 120, color: "#ff9800" },
  autoflowering: { name: "Автоцветущие", level: 1, growth: 12, yield: 15, color: "#03a9f4" },
  indica: { name: "Indica", level: 2, growth: 22, yield: 50, color: "#9c27b0" },
  sativa: { name: "Sativa", level: 2, growth: 26, yield: 55, color: "#e91e63" },
  hybrid: { name: "Hybrid", level: 3, growth: 20, yield: 70, color: "#607d8b" }
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
    this.disease = null;
  }

  water() {
    if (this.isDead) return false;
    this.lastWatered = Date.now();
    this.health = Math.min(100, this.health + (gameState.equipment.autoWater ? 5 : 15));
    addXP(2);
    return true;
  }

  fertilize() {
    if (this.isDead || this.health >= 100) return false;
    this.health = Math.min(100, this.health + 25);
    addXP(5);
    return true;
  }

  harvest() {
    if (this.stage < 4 || this.isDead) return null;
    const quality = Math.max(1, Math.floor(this.health / 10));
    const income = Math.round(this.meta.yield * quality * (1 + (gameState.player.level - 1) * 0.1));
    gameState.player.money += income;
    gameState.stats.harvested++;
    gameState.stats.income += income;
    addXP(20);
    if (!gameState.achievements.firstHarvest) {
      gameState.achievements.firstHarvest = true;
      showToast("✅ Первый урожай собран!", "success");
    }
    if (gameState.stats.harvested >= 10 && !gameState.achievements.tenHarvests) {
      gameState.achievements.tenHarvests = true;
      showToast("🏆 10 урожаев! Награда +200 ₽", "success");
      gameState.player.money += 200;
    }
    return { income, quality };
  }

  update() {
    if (this.isDead) return;
    const hours = (Date.now() - this.plantedAt) / (1000 * 60 * 60);
    this.stage = Math.min(4, Math.floor((hours / this.meta.growth) * 5));
    if (Date.now() - this.lastWatered > 12 * 60 * 60 * 1000) {
      this.health -= 0.5;
    }
    if (this.health <= 0) {
      this.isDead = true;
      gameState.stats.dead++;
    }
  }
}

export function createPlant(type) {
  if (!gameState.inventory.seeds[type] || gameState.inventory.seeds[type] <= 0) return null;
  if (gameState.player.level < SEEDS[type].level) return null;
  gameState.inventory.seeds[type]--;
  const plant = new Plant(type);
  gameState.plants.push(plant);
  gameState.stats.planted++;
  if (!gameState.achievements.firstPlant) {
    gameState.achievements.firstPlant = true;
    showToast("🌱 Первое растение посажено!", "success");
  }
  return plant;
}
