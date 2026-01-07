import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
import { getUpgradeCost, getUpgradeLevel, getUpgradeValue, purchaseUpgrade, type UpgradeKey } from '@/systems/UpgradeSystem';
import { saveManager } from '@/systems/SaveManager';

interface UpgradeRow {
  key: UpgradeKey;
  label: string;
}

const UPGRADE_ROWS: UpgradeRow[] = [
  { key: 'maxFishes', label: 'MAX FISHES' },
  { key: 'maxDepth', label: 'MAX DEPTH' },
  { key: 'earnings', label: 'EARNINGS' }
];

export class ShopScene extends Phaser.Scene {
  private coinText?: Phaser.GameObjects.Text;
  private valueTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('ShopScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.add.text(width / 2, 120, 'SHOP', {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.coinText = this.add.text(width / 2, 180, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '24px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const startY = 280;
    const gap = 140;

    UPGRADE_ROWS.forEach((row, index) => {
      const y = startY + index * gap;
      this.add.text(width / 2, y - 30, row.label, {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#0f172a'
      }).setOrigin(0.5);

      const valueText = this.add.text(width / 2, y, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '20px',
        color: '#0f172a'
      }).setOrigin(0.5);
      this.valueTexts.push(valueText);

      new Button(this, width / 2, y + 50, 'BUY', () => {
        if (purchaseUpgrade(row.key)) {
          void saveManager.save();
          this.refreshUI();
        }
      });
    });

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    });

    this.refreshUI();
  }

  private refreshUI(): void {
    const coins = saveManager.data.coins;
    this.coinText?.setText(`COINS: $${coins}`);

    UPGRADE_ROWS.forEach((row, index) => {
      const level = getUpgradeLevel(row.key);
      const value = getUpgradeValue(row.key);
      const cost = getUpgradeCost(row.key);
      this.valueTexts[index]?.setText(`LV ${level} | VALUE ${Math.floor(value)} | COST $${Math.floor(cost)}`);
    });
  }
}
