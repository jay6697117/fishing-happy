import { ENERGY_CONFIG } from '@/config/GameConstants';
import { saveManager, type GameSave } from '@/systems/SaveManager';

export function applyEnergyRegen(now = Date.now()): number {
  const current = saveManager.data.energy;
  const maxEnergy = ENERGY_CONFIG.maxEnergy;
  if (current >= maxEnergy) {
    saveManager.update({ lastEnergyTimestamp: now });
    return 0;
  }

  const intervalMs = ENERGY_CONFIG.regenIntervalSeconds * 1000;
  const elapsed = now - saveManager.data.lastEnergyTimestamp;
  if (elapsed <= 0) {
    saveManager.update({ lastEnergyTimestamp: now });
    return 0;
  }
  const restored = Math.floor(elapsed / intervalMs);
  if (restored <= 0) return 0;

  const nextEnergy = Math.min(maxEnergy, current + restored);
  const remainder = elapsed % intervalMs;
  saveManager.update({
    energy: nextEnergy,
    lastEnergyTimestamp: now - remainder
  });

  return nextEnergy - current;
}

export function hasEnergy(): boolean {
  return saveManager.data.energy > 0;
}

export function consumeEnergy(amount = 1): boolean {
  const current = saveManager.data.energy;
  const wasFull = current >= ENERGY_CONFIG.maxEnergy;
  if (current < amount) return false;
  const nextEnergy = Math.max(current - amount, 0);
  const update: Partial<GameSave> = { energy: nextEnergy };
  if (wasFull) {
    update.lastEnergyTimestamp = Date.now();
  }
  saveManager.update(update);
  return true;
}

export function restoreEnergy(amount = 1): void {
  const current = saveManager.data.energy;
  const nextEnergy = Math.min(current + amount, ENERGY_CONFIG.maxEnergy);
  const update: Partial<GameSave> = { energy: nextEnergy };
  if (nextEnergy >= ENERGY_CONFIG.maxEnergy) {
    update.lastEnergyTimestamp = Date.now();
  }
  saveManager.update(update);
}
