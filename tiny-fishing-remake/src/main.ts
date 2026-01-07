import Phaser from 'phaser';
import { gameConfig } from '@/config/GameConfig';
import { saveManager } from '@/systems/SaveManager';

void (async () => {
  await saveManager.load();
  new Phaser.Game(gameConfig);
})();
