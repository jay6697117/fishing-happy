import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
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

    new Button(this, width / 2, height / 2 - 60, 'PLAY', () => {
      this.scene.start('GameScene');
    });

    new Button(this, width / 2, height / 2 + 20, 'SHOP', () => {
      this.scene.start('ShopScene');
    });

    new Button(this, width / 2, height / 2 + 100, 'HOOKS', () => {
      this.scene.start('HooksScene');
    });

    new Button(this, width / 2, height / 2 + 180, 'AQUARIUM', () => {
      this.scene.start('AquariumScene');
    });

    new Button(this, width / 2, height / 2 + 260, 'PRIZES', () => {
      this.scene.start('PrizesScene');
    });

    new Button(this, width / 2, height / 2 + 340, 'SETTINGS', () => {
      this.scene.start('SettingsScene');
    });

    const coins = saveManager.data.coins;
    this.add.text(width / 2, height - 80, `COINS: $${coins}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);
  }
}
