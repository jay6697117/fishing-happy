export const UPGRADE_CONFIG = {
  maxFishes: {
    id: 'fishes',
    name: 'MAX FISHES',
    baseValue: 3,
    getValue: (level: number): number => 3 + level,
    getCost: (level: number): number => roundDownToFive(50 * Math.pow(1.5, level))
  },
  maxDepth: {
    id: 'depth',
    name: 'MAX DEPTH',
    baseValue: 3,
    getValue: (level: number): number => 3 + level,
    getCost: (level: number): number => roundDownToFive(50 * Math.pow(1.5, level))
  },
  earnings: {
    id: 'earnings',
    name: 'EARNINGS',
    baseValue: 5,
    getValue: (level: number): number => roundDownToFive(5 * Math.pow(1.5, level)),
    getCost: (level: number): number => roundDownToFive(50 * Math.pow(1.5, level))
  }
};

export const OFFLINE_CONFIG = {
  maxMinutes: 300,
  baseEarningsPerMinute: 5,
  earningsMultiplier: 1.5
};

export const ENERGY_CONFIG = {
  defaultEnergy: 30,
  maxEnergy: 30,
  regenIntervalSeconds: 300
};

export const PHYSICS = {
  hookSinkSpeed: 360,
  hookRiseSpeed: 520,
  hookMoveSpeed: 220,
  depthUnitPixels: 100,
  waterSurfaceY: 280
};

export const GAMEPLAY = {
  maxPointerCount: 3,
  fishSpawnMinGap: 90,
  fishSpawnIntervalMs: 600,
  treasureSpawnChance: 0.03
};

export const AQUARIUM_CONFIG = {
  earningIntervalMinutes: 5,
  claimMultiplierDefault: 1,
  claimMultiplierBonus: 4
};

export function roundDownToFive(value: number): number {
  return value - (value % 5);
}
