import { saveManager } from '@/systems/SaveManager';

export function applyOfflineEarnings(): number {
  const earnings = saveManager.calculateOfflineEarnings();
  if (earnings <= 0) return 0;
  const current = saveManager.data.coins;
  saveManager.update({ coins: current + earnings });
  return earnings;
}
