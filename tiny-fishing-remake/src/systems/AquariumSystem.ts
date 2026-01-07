import { AQUARIUM_CONFIG } from '@/config/GameConstants';
import { getFishById, type FishData } from '@/config/FishDatabase';
import { saveManager } from '@/systems/SaveManager';

export interface AquariumCollectResult {
  totalCoins: number;
  collectedFishIds: number[];
}

export function getMaxEarningForFishType(type: number): number {
  if (type === 3) return 3;
  if (type === 2) return 2;
  return 1;
}

export function applyAquariumEarnings(deltaSeconds: number): boolean {
  if (deltaSeconds <= 0) return false;

  const save = saveManager.data;
  const fishEarnings = { ...save.fishEarnings };
  let changed = false;

  for (const fishId of save.caughtFishIds) {
    const fish = getFishById(fishId);
    if (!fish) continue;
    if (fish.type === 4) continue;
    const maxEarning = getMaxEarningForFishType(fish.type);
    const current = Number(fishEarnings[fishId] ?? 0);
    if (current >= maxEarning) continue;

    const increment = deltaSeconds / (60 * AQUARIUM_CONFIG.earningIntervalMinutes);
    const next = Math.min(maxEarning, current + increment);
    if (next !== current) {
      fishEarnings[fishId] = Number(next.toFixed(4));
      changed = true;
    }
  }

  if (changed) {
    saveManager.update({ fishEarnings });
  }

  return changed;
}

export function applyAquariumOfflineProgress(now = Date.now()): boolean {
  const save = saveManager.data;
  const elapsedSeconds = Math.max(0, (now - save.lastPlayedTimestamp) / 1000);
  if (elapsedSeconds <= 0) return false;

  const fishEarnings = { ...save.fishEarnings };
  let changed = false;

  for (const fishId of save.caughtFishIds) {
    const fish = getFishById(fishId);
    if (!fish) continue;
    if (fish.type === 4) continue;
    const maxEarning = getMaxEarningForFishType(fish.type);
    const current = Number(fishEarnings[fishId] ?? 0);
    if (current >= maxEarning) continue;

    const increment = elapsedSeconds / (60 * AQUARIUM_CONFIG.earningIntervalMinutes);
    const next = Math.min(maxEarning, current + increment);
    if (next !== current) {
      fishEarnings[fishId] = Number(next.toFixed(4));
      changed = true;
    }
  }

  if (changed) {
    saveManager.update({ fishEarnings });
  }

  return changed;
}

export function collectAllAquariumEarnings(multiplier = 1): AquariumCollectResult {
  const save = saveManager.data;
  const fishEarnings = { ...save.fishEarnings };
  let totalCoins = 0;
  const collectedFishIds: number[] = [];

  for (const fishId of save.caughtFishIds) {
    const fish = getFishById(fishId);
    if (!fish) continue;
    if (fish.type === 4) continue;
    const current = Number(fishEarnings[fishId] ?? 0);
    if (current < 1) continue;

    const stars = Math.max(1, Math.round(current));
    const coins = fish.price * 2 * stars * multiplier;
    totalCoins += coins;
    fishEarnings[fishId] = 0;
    collectedFishIds.push(fishId);
  }

  if (totalCoins > 0) {
    saveManager.update({
      coins: save.coins + totalCoins,
      fishEarnings
    });
  }

  return { totalCoins, collectedFishIds };
}

export function ensureFishEarningOnCatch(fish: FishData): void {
  if (fish.type === 4) return;
  const save = saveManager.data;
  const fishEarnings = { ...save.fishEarnings };
  const current = Number(fishEarnings[fish.id] ?? 0);
  if (current > 0) return;

  const maxEarning = getMaxEarningForFishType(fish.type);
  fishEarnings[fish.id] = maxEarning;
  saveManager.update({ fishEarnings });
}
