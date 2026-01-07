import { UPGRADE_CONFIG } from '@/config/GameConstants';
import { saveManager } from '@/systems/SaveManager';

export type UpgradeKey = keyof typeof UPGRADE_CONFIG;

export function getUpgradeLevel(key: UpgradeKey): number {
  const save = saveManager.data;
  switch (key) {
    case 'maxFishes':
      return save.maxFishesLevel;
    case 'maxDepth':
      return save.maxDepthLevel;
    case 'earnings':
      return save.earningPerMinLevel;
    default:
      return 0;
  }
}

export function getUpgradeValue(key: UpgradeKey): number {
  return UPGRADE_CONFIG[key].getValue(getUpgradeLevel(key));
}

export function getUpgradeCost(key: UpgradeKey): number {
  return UPGRADE_CONFIG[key].getCost(getUpgradeLevel(key));
}

export function canPurchaseUpgrade(key: UpgradeKey): boolean {
  return saveManager.data.coins >= getUpgradeCost(key);
}

export function purchaseUpgrade(key: UpgradeKey): boolean {
  if (!canPurchaseUpgrade(key)) return false;

  const cost = getUpgradeCost(key);
  const save = saveManager.data;
  saveManager.update({ coins: save.coins - cost });

  switch (key) {
    case 'maxFishes':
      saveManager.update({ maxFishesLevel: save.maxFishesLevel + 1 });
      break;
    case 'maxDepth':
      saveManager.update({ maxDepthLevel: save.maxDepthLevel + 1 });
      break;
    case 'earnings':
      saveManager.update({ earningPerMinLevel: save.earningPerMinLevel + 1 });
      break;
  }

  return true;
}
