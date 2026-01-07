import fishData from '@/data/fish.json';
import { PHYSICS } from '@/config/GameConstants';

export interface FishData {
  id: number;
  spriteId: number;
  spriteName: string;
  price: number;
  minDepth: number;
  maxDepth: number;
  rarityWeight: number;
  type: number;
  scale: number;
  animType: number;
}

const FISH_DATABASE = fishData as FishData[];

export function getFishByDepth(depthPixels: number): FishData[] {
  const depthUnits = depthPixels / PHYSICS.depthUnitPixels;
  return FISH_DATABASE.filter((fish) => depthUnits >= fish.minDepth && depthUnits <= fish.maxDepth);
}

export function getRandomFishByDepth(depthPixels: number): FishData | null {
  const depthUnits = depthPixels / PHYSICS.depthUnitPixels;
  const candidates = FISH_DATABASE
    .filter((fish) => fish.type !== 4)
    .filter((fish) => depthUnits >= fish.minDepth && depthUnits <= fish.maxDepth)
    .sort((a, b) => a.minDepth - b.minDepth);

  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  const totalWeight = candidates.reduce((sum, fish) => sum + fish.rarityWeight, 0);
  const roll = Math.random() * totalWeight;
  let acc = 0;
  for (const fish of candidates) {
    acc += fish.rarityWeight;
    if (roll <= acc) return fish;
  }
  return candidates[0];
}

export function getFishById(id: number): FishData | undefined {
  return FISH_DATABASE.find((fish) => fish.id === id);
}
