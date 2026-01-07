import { ENERGY_CONFIG } from '@/config/GameConstants';
import { saveManager } from '@/systems/SaveManager';

export function hasEnergy(): boolean {
  return saveManager.data.energy > 0;
}

export function consumeEnergy(amount = 1): boolean {
  const current = saveManager.data.energy;
  if (current < amount) return false;
  saveManager.update({ energy: Math.max(current - amount, 0) });
  return true;
}

export function restoreEnergy(amount = 1): void {
  const current = saveManager.data.energy;
  saveManager.update({ energy: Math.min(current + amount, ENERGY_CONFIG.maxEnergy) });
}
