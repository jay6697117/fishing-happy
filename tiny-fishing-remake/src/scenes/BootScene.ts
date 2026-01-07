import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { applyOfflineEarnings } from '@/systems/OfflineEarnings';
import { saveManager } from '@/systems/SaveManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    const { width, height } = this.scale;
    const barWidth = 360;
    const barHeight = 20;

    const border = this.add.rectangle(width / 2, height / 2, barWidth + 8, barHeight + 8, 0x0f172a, 0.6);
    const bar = this.add.rectangle(width / 2 - barWidth / 2, height / 2, 0, barHeight, 0x38bdf8, 1).setOrigin(0, 0.5);
    const label = this.add.text(width / 2, height / 2 - 40, 'Loading...', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      bar.width = Math.floor(barWidth * value);
    });

    this.load.on('complete', () => {
      border.destroy();
      bar.destroy();
      label.destroy();
    });

    this.load.image(AssetKeys.images.background, 'assets/raw/bg.png');

    this.load.audio(AssetKeys.audio.musicBackground, 'assets/audio/snd_musicBackground.ogg');
    this.load.audio(AssetKeys.audio.splash1, 'assets/audio/snd_splash1.ogg');
    this.load.audio(AssetKeys.audio.splash2, 'assets/audio/snd_splash2.ogg');
    this.load.audio(AssetKeys.audio.startFishing, 'assets/audio/snd_startFishing.ogg');
    this.load.audio(AssetKeys.audio.fishReel, 'assets/audio/snd_fishReel.ogg');
    this.load.audio(AssetKeys.audio.coinAdded, 'assets/audio/snd_coinAdded.ogg');
    this.load.audio(AssetKeys.audio.upgrade, 'assets/audio/snd_upgradeSnd.ogg');
  }

  create(): void {
    const offlineEarnings = applyOfflineEarnings();
    void saveManager.save();
    this.scene.start('MainMenuScene', { offlineEarnings });
  }
}
