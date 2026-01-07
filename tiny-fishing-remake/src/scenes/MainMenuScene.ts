import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
import { applyEnergyRegen } from '@/systems/EnergySystem';
import { applyPrizeTimer } from '@/systems/PrizeSystem';
import { saveManager } from '@/systems/SaveManager';

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

    this.add.text(width / 2, 140, 'TINY FISHING', {
      fontFamily: 'Trebuchet MS',
      fontSize: '56px',
      color: '#0f172a'
    }).setOrigin(0.5);

    if (data.offlineEarnings && data.offlineEarnings > 0) {
      this.add.text(width / 2, 220, `OFFLINE +$${data.offlineEarnings}`, {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#0f172a'
      }).setOrigin(0.5);
    }

    const buttons = [
      { label: 'PLAY', target: 'GameScene' },
      { label: 'SHOP', target: 'ShopScene' },
      { label: 'HOOKS', target: 'HooksScene' },
      { label: 'AQUARIUM', target: 'AquariumScene' },
      { label: 'PRIZES', target: 'PrizesScene' },
      { label: 'ENERGY', target: 'EnergyScene' },
      { label: 'SETTINGS', target: 'SettingsScene' }
    ];

    const startY = height / 2 - 210;
    const gap = 70;
    buttons.forEach((button, index) => {
      new Button(this, width / 2, startY + gap * index, button.label, () => {
        this.scene.start(button.target);
      });
    });

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
