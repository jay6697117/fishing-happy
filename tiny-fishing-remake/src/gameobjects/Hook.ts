import Phaser from 'phaser';
import { PHYSICS } from '@/config/GameConstants';
import type { Fish } from '@/gameobjects/Fish';

export type HookState = 'idle' | 'diving' | 'rising';

export class Hook extends Phaser.Physics.Arcade.Image {
  public state: HookState = 'idle';
  public maxDepthY = PHYSICS.waterSurfaceY + PHYSICS.depthUnitPixels * 3;
  public maxFishes = 3;
  public caughtFish: Fish[] = [];

  private onSurfaceCallback: (() => void) | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hook-placeholder');
    this.setDepth(20);
    this.setOrigin(0.5, 0);
  }

  startDive(onSurface: () => void): void {
    this.state = 'diving';
    this.onSurfaceCallback = onSurface;
  }

  startRise(): void {
    if (this.state !== 'rising') {
      this.state = 'rising';
    }
  }

  reset(x: number, y: number): void {
    this.state = 'idle';
    this.setPosition(x, y);
    this.caughtFish.length = 0;
  }

  attachFish(fish: Fish): void {
    this.caughtFish.push(fish);
  }

  update(deltaSeconds: number): void {
    if (this.state === 'diving') {
      this.y += PHYSICS.hookSinkSpeed * deltaSeconds;
      if (this.y >= this.maxDepthY || this.caughtFish.length >= this.maxFishes) {
        this.startRise();
      }
    } else if (this.state === 'rising') {
      this.y -= PHYSICS.hookRiseSpeed * deltaSeconds;
      if (this.y <= PHYSICS.waterSurfaceY) {
        this.y = PHYSICS.waterSurfaceY;
        this.state = 'idle';
        this.onSurfaceCallback?.();
      }
    }
  }
}
