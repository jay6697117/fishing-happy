import { PHYSICS } from '@/config/GameConstants';
import { getAllHooks } from '@/config/HookDatabase';
import { getRandomFishByDepth } from '@/config/FishDatabase';
import { getUpgradeValue } from '@/systems/UpgradeSystem';
import { saveManager, type PrizeRecord } from '@/systems/SaveManager';

export type PrizeType = PrizeRecord['type'];

export interface PrizeItem {
  id: number;
  type: PrizeType;
  value: number;
}

const PRIZE_CONFIG = {
  keyIntervalSeconds: 18000,
  maxKeys: 3
};

export function applyPrizeTimer(now = Date.now()): number {
  const save = saveManager.data;
  const intervalMs = PRIZE_CONFIG.keyIntervalSeconds * 1000;
  const elapsed = now - save.lastPrizeTimestamp;
  if (elapsed <= 0) {
    saveManager.update({ lastPrizeTimestamp: now });
    return 0;
  }
  const earned = Math.floor(elapsed / intervalMs);
  if (earned <= 0) return 0;

  const nextKeys = Math.min(PRIZE_CONFIG.maxKeys, save.prizeKeys + earned);
  const remainder = elapsed % intervalMs;
  saveManager.update({
    prizeKeys: nextKeys,
    lastPrizeTimestamp: now - remainder
  });

  return nextKeys - save.prizeKeys;
}

export function consumePrizeKey(): boolean {
  const current = saveManager.data.prizeKeys;
  if (current <= 0) return false;
  saveManager.update({ prizeKeys: current - 1 });
  return true;
}

export function createPrizePool(): PrizeItem[] {
  const baseValue = Math.max(1, Math.round(calculateExpectedCatchValue()));
  const prizes: PrizeItem[] = [
    { id: 0, type: 'gems', value: 25 },
    { id: 1, type: 'gems', value: 50 },
    { id: 2, type: 'gems', value: 50 },
    { id: 3, type: 'gems', value: 100 },
    { id: 4, type: 'coins', value: Math.round(baseValue * 1) },
    { id: 5, type: 'coins', value: Math.round(baseValue * 2) },
    { id: 6, type: 'coins', value: Math.round(baseValue * 2) },
    { id: 7, type: 'coins', value: Math.round(baseValue * 4) }
  ];

  const hookId = getRandomLockedHookId();
  if (hookId !== null) {
    prizes.push({ id: 8, type: 'hook', value: hookId });
  } else {
    prizes.push({ id: 8, type: 'gems', value: 200 });
  }

  return shuffle(prizes).map((prize, index) => ({ ...prize, id: index }));
}

export function applyPrize(prize: PrizeItem): void {
  const save = saveManager.data;
  if (prize.type === 'coins') {
    saveManager.update({ coins: save.coins + prize.value });
  } else if (prize.type === 'gems') {
    saveManager.update({ gems: save.gems + prize.value });
  } else if (prize.type === 'hook') {
    const unlocked = new Set(save.unlockedHookIds);
    unlocked.add(prize.value);
    saveManager.update({ unlockedHookIds: Array.from(unlocked) });
  }

  const nextBest = chooseBestPrize(saveManager.data.bestPrize, prize);
  if (nextBest) {
    saveManager.update({ bestPrize: nextBest });
  }
}

export function formatPrize(prize: PrizeItem): string {
  if (prize.type === 'coins') return `+$${prize.value}`;
  if (prize.type === 'gems') return `+${prize.value} GEMS`;
  return `HOOK ${prize.value}`;
}

function calculateExpectedCatchValue(): number {
  const maxDepthUnits = getUpgradeValue('maxDepth');
  const maxFishes = getUpgradeValue('maxFishes');
  const depthPixels = maxDepthUnits * PHYSICS.depthUnitPixels;

  let total = 0;
  for (let i = 0; i < maxFishes; i += 1) {
    const fish = getRandomFishByDepth(depthPixels);
    if (fish) total += fish.price;
  }
  return total;
}

function getRandomLockedHookId(): number | null {
  const hooks = getAllHooks();
  const unlocked = new Set(saveManager.data.unlockedHookIds);
  const locked = hooks.filter((hook) => !unlocked.has(hook.id));
  if (locked.length === 0) return null;
  const pick = locked[Math.floor(Math.random() * locked.length)];
  return pick.id;
}

function chooseBestPrize(current: PrizeRecord | null, next: PrizeItem): PrizeRecord | null {
  if (!current) return { type: next.type, value: next.value };

  const score = prizeScore(current.type, current.value);
  const nextScore = prizeScore(next.type, next.value);
  if (nextScore >= score) {
    return { type: next.type, value: next.value };
  }
  return current;
}

function prizeScore(type: PrizeRecord['type'], value: number): number {
  if (type === 'hook') return 100000 + value;
  if (type === 'coins') return 1000 + value;
  return value;
}

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
