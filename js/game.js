export const gameState = {
  player: {
    level: 1,
    xp: 0,
    xpToNext: 100,
    money: 1500,
    crystals: 100
  },
  plants: [],
  equipment: {
    led: true,
    ventilation: true,
    carbonFilter: true,
    growTent: true,
    autoWater: false,
    hydroponics: false,
    co2: false,
    climateControl: false
  },
  inventory: {
    seeds: {
      basic: 3,
      improved: 0,
      elite: 0,
      legendary: 0,
      autoflowering: 0,
      indica: 0,
      sativa: 1,
      hybrid: 0
    },
    consumables: {
      fertilizer: 5,
      antifungus: 2,
      pesticide: 2,
      antivirus: 1,
      revival: 0,
      superWater: 0
    }
  },
  stats: {
    planted: 0,
    harvested: 0,
    income: 0,
    cured: 0,
    dead: 0
  },
  achievements: {
    firstPlant: false,
    firstHarvest: false,
    level5: false,
    tenHarvests: false,
    fiveCured: false
  }
};

export function addXP(amount) {
  gameState.player.xp += amount;
  while (gameState.player.xp >= gameState.player.xpToNext) {
    gameState.player.xp -= gameState.player.xpToNext;
    gameState.player.level++;
    gameState.player.xpToNext = Math.floor(100 * Math.pow(1.4, gameState.player.level - 1));
    if (gameState.player.level >= 5 && !gameState.achievements.level5) {
      gameState.achievements.level5 = true;
      showToast("🏆 Достижение: Уровень 5!", "success");
    }
  }
}
