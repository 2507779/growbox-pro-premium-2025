// Все данные растений с фото
export const PLANT_TYPES = {
  basic: { name: "Базовые", level: 1, growth: 24, yield: 20, img: "assets/plants/basic.jpg" },
  sativa: { name: "Sativa", level: 2, growth: 26, yield: 55, img: "assets/plants/sativa.jpg" },
  indica: { name: "Indica", level: 2, growth: 22, yield: 50, img: "assets/plants/indica.jpg" },
  hybrid: { name: "Hybrid", level: 3, growth: 20, yield: 70, img: "assets/plants/hybrid.jpg" },
  autoflowering: { name: "Автоцветущие", level: 1, growth: 12, yield: 15, img: "assets/plants/autoflowering.jpg" },
  improved: { name: "Улучшенные", level: 2, growth: 20, yield: 35, img: "assets/plants/improved.jpg" },
  elite: { name: "Элитные", level: 3, growth: 18, yield: 60, img: "assets/plants/elite.jpg" },
  legendary: { name: "Легендарные", level: 5, growth: 16, yield: 120, img: "assets/plants/legendary.jpg" }
};

export class Plant {
  constructor(type) {
    const meta = PLANT_TYPES[type];
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
    return true;
  }

  harvest() {
    if (this.stage < 4 || this.isDead) return null;
    const quality = Math.max(1, Math.floor(this.health / 10));
    const income = Math.round(this.meta.yield * quality * (1 + (window.gameState.player.level - 1) * 0.1));
    return { income, quality };
  }

  update() {
    if (this.isDead) return;
    const hours = (Date.now() - this.plantedAt) / (1000 * 60 * 60);
    this.stage = Math.min(4, Math.floor((hours / this.meta.growth) * 5));
    if (Date.now() - this.lastWatered > 12 * 60 * 60 * 1000) {
      this.health -= 0.5;
    }
    if (this.health <= 0) this.isDead = true;
  }
}
