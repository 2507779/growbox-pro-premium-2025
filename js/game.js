// Состояние игры
export const gameState = {
  player: {
    level: 1,
    xp: 0,
    xpToNext: 100,
    money: 1000,
    crystals: 50
  },
  plants: [],
  inventory: {
    seeds: { basic: 2, sativa: 1 },
    consumables: { fertilizer: 3, antifungus: 1 }
  },
  achievements: {
    firstPlant: false,
    firstHarvest: false
  }
};

export function addXP(amount) {
  gameState.player.xp += amount;
  if (gameState.player.xp >= gameState.player.xpToNext) {
    gameState.player.level++;
    gameState.player.xp -= gameState.player.xpToNext;
    gameState.player.xpToNext = Math.floor(100 * Math.pow(1.4, gameState.player.level - 1));
  }
}