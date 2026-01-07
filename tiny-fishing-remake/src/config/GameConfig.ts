import Phaser from 'phaser';
import { BootScene } from '@/scenes/BootScene';
import { MainMenuScene } from '@/scenes/MainMenuScene';
import { GameScene } from '@/scenes/GameScene';
import { ShopScene } from '@/scenes/ShopScene';
import { AquariumScene } from '@/scenes/AquariumScene';
import { PrizesScene } from '@/scenes/PrizesScene';
import { HooksScene } from '@/scenes/HooksScene';
import { SettingsScene } from '@/scenes/SettingsScene';
import { EnergyScene } from '@/scenes/EnergyScene';
import { VipScene } from '@/scenes/VipScene';
import { ScoreScene } from '@/scenes/ScoreScene';
import { ChestScene } from '@/scenes/ChestScene';
import { GAMEPLAY } from '@/config/GameConstants';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#87CEEB',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 640, height: 360 },
    max: { width: 1920, height: 1080 }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: import.meta.env.DEV
    }
  },
  input: {
    activePointers: GAMEPLAY.maxPointerCount
  },
  render: {
    antialias: false,
    pixelArt: false,
    powerPreference: 'high-performance'
  },
  fps: {
    target: 60,
    forceSetTimeOut: false
  },
  scene: [
    BootScene,
    MainMenuScene,
    GameScene,
    ShopScene,
    AquariumScene,
    PrizesScene,
    HooksScene,
    SettingsScene,
    EnergyScene,
    VipScene,
    ChestScene,
    ScoreScene
  ]
};
