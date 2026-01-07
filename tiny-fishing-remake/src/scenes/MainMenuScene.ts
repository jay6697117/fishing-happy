import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
import { applyEnergyRegen } from '@/systems/EnergySystem';
import { applyPrizeTimer } from '@/systems/PrizeSystem';
import { saveManager } from '@/systems/SaveManager';
import { getFirstFrame } from '@/config/SpriteFrames';
import { t } from '@/systems/Localization';
import { FEATURE_FLAGS } from '@/config/FeatureFlags';

interface MainMenuData {
  offlineEarnings?: number;
}

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(data: MainMenuData): void {
    const { width, height } = this.scale;
    applyEnergyRegen();
    applyPrizeTimer();
    void saveManager.save();

    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    const titleFrame = getFirstFrame('spr_tfcaption');
    this.add.image(width / 2, 150, AssetKeys.atlases.main, titleFrame).setScale(0.9);

    if (data.offlineEarnings && data.offlineEarnings > 0) {
      this.add.text(width / 2, 230, `${t('Earned_offline', 'EARNED OFFLINE')} +$${data.offlineEarnings}`, {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#0f172a'
      }).setOrigin(0.5);
    }

    const buttons = [
      { label: t('Play', 'PLAY'), target: 'GameScene', frameName: 'spr_butOrange' },
      { label: 'SHOP', target: 'ShopScene', frameName: 'spr_butDark' },
      { label: t('Hooks', 'HOOKS'), target: 'HooksScene', frameName: 'spr_butDark' },
      { label: t('Aquarium', 'AQUARIUM'), target: 'AquariumScene', frameName: 'spr_butDark' },
      { label: 'PRIZES', target: 'PrizesScene', frameName: 'spr_butDark' },
      { label: t('Energy', 'ENERGY'), target: 'EnergyScene', frameName: 'spr_butDark' },
      { label: t('Settings', 'SETTINGS'), target: 'SettingsScene', frameName: 'spr_butDark' }
    ];

    const startY = height / 2 - 210;
    const gap = 70;
    buttons.forEach((button, index) => {
      new Button(this, width / 2, startY + gap * index, button.label, () => {
        this.scene.start(button.target);
      }, { frameName: button.frameName, scale: 0.75 });
    });

    if (FEATURE_FLAGS.enableVip) {
      new Button(this, width / 2, startY + gap * buttons.length, t('Become_VIP', 'BECOME VIP'), () => {
        this.scene.start('VipScene');
      }, { frameName: 'spr_butOrange', scale: 0.7, fontSize: '20px' });
    }

    const coins = saveManager.data.coins;
    const energy = saveManager.data.energy;
    const keys = saveManager.data.prizeKeys;
    const gems = saveManager.data.gems;
    this.add.text(width / 2, height - 80, `COINS: $${coins} | GEMS: ${gems} | ENERGY: ${energy} | KEYS: ${keys}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);
  }
}
