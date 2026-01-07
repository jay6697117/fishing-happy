import Phaser from 'phaser';
import type { FishData } from '@/config/FishDatabase';

export class Fish extends Phaser.Physics.Arcade.Image {
  public readonly data: FishData;
  public caught = false;

  constructor(scene: Phaser.Scene, x: number, y: number, data: FishData) {
    super(scene, x, y, 'fish-placeholder');
    this.data = data;

    this.setScale(data.scale);
    this.setDepth(10);
    this.setCollideWorldBounds(false);
  }

  swim(speed: number, direction: 1 | -1): void {
    this.setVelocityX(speed * direction);
    this.setFlipX(direction < 0);
  }
}
