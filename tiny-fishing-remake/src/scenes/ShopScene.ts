import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { getFirstFrame, getFrames } from '@/config/SpriteFrames';
import { Button } from '@/ui/Button';
import { getUpgradeCost, getUpgradeLevel, getUpgradeValue, purchaseUpgrade, type UpgradeKey } from '@/systems/UpgradeSystem';
import { saveManager } from '@/systems/SaveManager';
import { t } from '@/systems/Localization';

interface UpgradeRow {
  key: UpgradeKey;
  label: string;
}

const UPGRADE_ROWS: UpgradeRow[] = [
  { key: 'maxFishes', label: 'Fish_upgrade_title' },
  { key: 'maxDepth', label: 'Depth_upgrade_title' },
  { key: 'earnings', label: 'Offline_earnings_upgrade_title' }
];

export class ShopScene extends Phaser.Scene {
  private coinText?: Phaser.GameObjects.Text;
  private valueTexts: Phaser.GameObjects.Text[] = [];
  private priceTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('ShopScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.add.text(width / 2, 120, t('Earnings', 'EARNINGS'), {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.coinText = this.add.text(width / 2, 180, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '24px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const startY = 320;
    const gap = 280;
    const bgFrames = getFrames('spr_upgBG');
    const iconMap: Record<UpgradeKey, string> = {
      maxFishes: 'spr_upgFishes',
      maxDepth: 'spr_upgDepth',
      earnings: 'spr_upgMoney'
    };

    UPGRADE_ROWS.forEach((row, index) => {
      const y = startY + index * gap;
      const bgFrame = bgFrames[index % bgFrames.length] ?? getFirstFrame('spr_upgBG');
      this.add.image(width / 2, y, AssetKeys.atlases.main, bgFrame).setScale(0.78);

      this.add.text(width / 2, y - bg.displayHeight / 2 + 32, t(row.label, row.label), {
        fontFamily: 'Trebuchet MS',
        fontSize: '20px',
        color: '#0f172a'
      }).setOrigin(0.5);

      this.add.image(width / 2, y - 40, AssetKeys.atlases.main, getFirstFrame(iconMap[row.key])).setScale(0.8);

      const valueText = this.add.text(width / 2, y + 20, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '18px',
        color: '#0f172a'
      }).setOrigin(0.5);
      this.valueTexts.push(valueText);

      const priceText = this.add.text(width / 2, y + 52, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '18px',
        color: '#0f172a'
      }).setOrigin(0.5);
      this.priceTexts.push(priceText);

      new Button(this, width / 2, y + 110, t('Buy', 'BUY'), () => {
        if (purchaseUpgrade(row.key)) {
          void saveManager.save();
          this.refreshUI();
        }
      }, { frameName: 'spr_butOrangeSmall', scale: 0.6, fontSize: '18px' });
    });

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    }, { frameName: 'spr_butDark', scale: 0.65, fontSize: '18px' });

    this.refreshUI();
  }

  private refreshUI(): void {
    const coins = saveManager.data.coins;
    this.coinText?.setText(`COINS: $${coins}`);

    UPGRADE_ROWS.forEach((row, index) => {
      const level = getUpgradeLevel(row.key);
      const value = getUpgradeValue(row.key);
      const cost = getUpgradeCost(row.key);
      this.valueTexts[index]?.setText(`LV ${level} | VALUE ${Math.floor(value)}`);
      this.priceTexts[index]?.setText(`${t('Price', 'PRICE')} $${Math.floor(cost)}`);
    });
  }
}
