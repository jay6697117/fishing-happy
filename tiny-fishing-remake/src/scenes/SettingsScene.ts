import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
import { saveManager } from '@/systems/SaveManager';

export class SettingsScene extends Phaser.Scene {
  private infoText?: Phaser.GameObjects.Text;

  constructor() {
    super('SettingsScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.add.text(width / 2, 140, 'SETTINGS', {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.infoText = this.add.text(width / 2, height / 2 - 20, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    new Button(this, width / 2, height / 2 + 60, 'RESET SAVE', () => {
      void saveManager.reset().then(() => this.refreshUI());
    });

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    });

    this.refreshUI();
  }

  private refreshUI(): void {
    const save = saveManager.data;
    this.infoText?.setText(`LANG: ${save.language} | MUSIC: ${Math.round(save.musicVolume * 100)}%`);
  }
}
