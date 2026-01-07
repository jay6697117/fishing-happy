import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { PHYSICS } from '@/config/GameConstants';
import { getRandomFishByDepth } from '@/config/FishDatabase';
import { getUpgradeValue } from '@/systems/UpgradeSystem';
import { saveManager } from '@/systems/SaveManager';
import { consumeEnergy, hasEnergy } from '@/systems/EnergySystem';
import { Fish } from '@/gameobjects/Fish';
import { Hook } from '@/gameobjects/Hook';

export class GameScene extends Phaser.Scene {
  private hook!: Hook;
  private fishGroup!: Phaser.Physics.Arcade.Group;
  private spawnTimer?: Phaser.Time.TimerEvent;
  private statusText?: Phaser.GameObjects.Text;
  private runEarnings = 0;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.createPlaceholderTextures();

    this.fishGroup = this.physics.add.group();

    this.hook = new Hook(this, width / 2, PHYSICS.waterSurfaceY);
    this.physics.add.existing(this.hook);
    this.hook.setImmovable(true);

    this.statusText = this.add.text(width / 2, 80, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.input.on('pointerdown', () => this.tryStartRun());
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.hook.state === 'diving' || this.hook.state === 'rising') {
        this.hook.x = Phaser.Math.Clamp(pointer.worldX, 60, width - 60);
      }
    });

    this.physics.add.overlap(this.hook, this.fishGroup, (_, fish) => {
      const target = fish as Fish;
      if (target.caught || this.hook.state !== 'diving') return;
      if (this.hook.caughtFish.length >= this.hook.maxFishes) return;
      target.caught = true;
      target.setVelocity(0, 0);
      target.setDepth(15);
      this.hook.attachFish(target);
      if (this.hook.caughtFish.length >= this.hook.maxFishes) {
        this.hook.startRise();
      }
    });

    this.updateStatus();
  }

  update(_: number, delta: number): void {
    const deltaSeconds = delta / 1000;
    this.hook.update(deltaSeconds);
    this.updateCaughtFish();
    this.recycleOffscreenFish();
  }

  private tryStartRun(): void {
    if (this.hook.state !== 'idle') return;
    if (!hasEnergy()) {
      this.flashStatus('NOT ENOUGH ENERGY');
      return;
    }

    consumeEnergy();
    this.runEarnings = 0;
    this.hook.maxFishes = getUpgradeValue('maxFishes');
    const maxDepthUnits = getUpgradeValue('maxDepth');
    this.hook.maxDepthY = PHYSICS.waterSurfaceY + maxDepthUnits * PHYSICS.depthUnitPixels;

    this.hook.startDive(() => this.onRunFinished());
    this.spawnTimer?.remove(false);
    this.spawnTimer = this.time.addEvent({
      delay: 600,
      loop: true,
      callback: () => this.spawnFish()
    });

    this.updateStatus();
  }

  private onRunFinished(): void {
    this.spawnTimer?.remove(false);
    this.spawnTimer = undefined;

    let totalValue = 0;
    for (const fish of this.hook.caughtFish) {
      totalValue += fish.data.price;
      if (!saveManager.data.caughtFishIds.includes(fish.data.id)) {
        saveManager.data.caughtFishIds.push(fish.data.id);
      }
    }

    const coins = saveManager.data.coins + totalValue;
    saveManager.update({
      coins,
      totalFishCaught: saveManager.data.totalFishCaught + this.hook.caughtFish.length
    });

    void saveManager.save();
    this.runEarnings = totalValue;
    this.clearCaughtFish();
    this.updateStatus();
  }

  private spawnFish(): void {
    if (this.hook.state !== 'diving') return;

    const depth = this.hook.y + Phaser.Math.Between(120, 420);
    const fishData = getRandomFishByDepth(depth);
    if (!fishData) return;

    const x = Phaser.Math.Between(80, this.scale.width - 80);
    const fish = new Fish(this, x, depth, fishData);
    this.add.existing(fish);
    this.physics.add.existing(fish);

    const direction = Math.random() > 0.5 ? 1 : -1;
    fish.swim(Phaser.Math.Between(60, 140), direction as 1 | -1);

    this.fishGroup.add(fish);
  }

  private updateCaughtFish(): void {
    if (this.hook.caughtFish.length === 0) return;
    const spacing = 36;
    this.hook.caughtFish.forEach((fish, index) => {
      fish.x = this.hook.x + (index % 2 === 0 ? -16 : 16);
      fish.y = this.hook.y + 28 + spacing * index;
    });
  }

  private recycleOffscreenFish(): void {
    const leftBound = -120;
    const rightBound = this.scale.width + 120;
    this.fishGroup.children.each((child) => {
      const fish = child as Fish;
      if (fish.caught) return;
      if (fish.x < leftBound || fish.x > rightBound) {
        fish.destroy();
      }
    });
  }

  private clearCaughtFish(): void {
    this.hook.caughtFish.forEach((fish) => fish.destroy());
    this.hook.caughtFish.length = 0;
  }

  private updateStatus(): void {
    if (!this.statusText) return;
    const energy = saveManager.data.energy;
    const coins = saveManager.data.coins;
    const lastEarnings = this.runEarnings > 0 ? ` | LAST +$${this.runEarnings}` : '';
    this.statusText.setText(`ENERGY: ${energy} | COINS: $${coins}${lastEarnings}`);
  }

  private flashStatus(message: string): void {
    if (!this.statusText) return;
    this.statusText.setText(message);
    this.time.delayedCall(1200, () => this.updateStatus());
  }

  private createPlaceholderTextures(): void {
    if (this.textures.exists('fish-placeholder')) return;

    const graphics = this.add.graphics();
    graphics.fillStyle(0xffb300, 1);
    graphics.fillEllipse(16, 8, 32, 16);
    graphics.generateTexture('fish-placeholder', 32, 16);
    graphics.clear();

    graphics.fillStyle(0x0f172a, 1);
    graphics.fillRect(0, 0, 12, 32);
    graphics.generateTexture('hook-placeholder', 12, 32);
    graphics.destroy();
  }
}
