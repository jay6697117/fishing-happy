import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';

export class PrizesScene extends Phaser.Scene {
  constructor() {
    super('PrizesScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.add.text(width / 2, 140, 'PRIZES', {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Coming soon', {
      fontFamily: 'Trebuchet MS',
      fontSize: '24px',
      color: '#0f172a'
    }).setOrigin(0.5);

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
