import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { ENERGY_CONFIG, GAMEPLAY, PHYSICS } from '@/config/GameConstants';
import { getRandomFishByDepth, getRandomTreasureByDepth } from '@/config/FishDatabase';
import { getHookById } from '@/config/HookDatabase';
import { getFirstFrame, getFrames } from '@/config/SpriteFrames';
import { getUpgradeValue } from '@/systems/UpgradeSystem';
import { saveManager } from '@/systems/SaveManager';
import { applyEnergyRegen, consumeEnergy, hasEnergy } from '@/systems/EnergySystem';
import { ensureFishEarningOnCatch } from '@/systems/AquariumSystem';
import { Fish } from '@/gameobjects/Fish';
import { Hook } from '@/gameobjects/Hook';
import { t } from '@/systems/Localization';
import type { ScoreSceneData } from '@/scenes/ScoreScene';

export class GameScene extends Phaser.Scene {
  private hook!: Hook;
  private fishGroup!: Phaser.Physics.Arcade.Group;
  private spawnTimer?: Phaser.Time.TimerEvent;
  private statusText?: Phaser.GameObjects.Text;
  private energyTimer = 0;
  private treasureCaught = false;
  private worldHeight = 0;
  private wave?: Phaser.GameObjects.TileSprite;
  private rope?: Phaser.GameObjects.Image;
  private coinText?: Phaser.GameObjects.Text;
  private depthText?: Phaser.GameObjects.Text;
  private energyFill?: Phaser.GameObjects.Image;
  private energyMask?: Phaser.GameObjects.Graphics;
  private energySpark?: Phaser.GameObjects.Image;
  private depthFill?: Phaser.GameObjects.Image;
  private depthMask?: Phaser.GameObjects.Graphics;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const { width, height } = this.scale;
    const maxDepthUnits = Math.max(3, getUpgradeValue('maxDepth'));
    const maxDepthY = PHYSICS.waterSurfaceY + maxDepthUnits * PHYSICS.depthUnitPixels;
    this.worldHeight = maxDepthY + height * 0.6;

    this.add.image(width / 2, this.worldHeight / 2, AssetKeys.images.background).setDisplaySize(width, this.worldHeight);
    this.physics.world.setBounds(0, 0, width, this.worldHeight);
    this.cameras.main.setBounds(0, 0, width, this.worldHeight);

    this.fishGroup = this.physics.add.group();

    const waveFrame = getFirstFrame('spr_wave');
    this.wave = this.add
      .tileSprite(width / 2, PHYSICS.waterSurfaceY + 60, width, 160, AssetKeys.atlases.main, waveFrame)
      .setDepth(4);

    const hookData = getHookById(saveManager.data.hookChosenId) ?? getHookById(1);
    const hookFrame = hookData ? getFirstFrame(hookData.spriteName) : 'unknown';
    const hookSize = hookData?.sizeY ?? 120;
    this.hook = new Hook(this, width / 2, PHYSICS.waterSurfaceY, AssetKeys.atlases.main, hookFrame, hookSize);
    this.physics.add.existing(this.hook);
    this.hook.setImmovable(true);

    this.rope = this.add
      .image(this.hook.x, PHYSICS.waterSurfaceY, AssetKeys.atlases.main, getFirstFrame('spr_rope'))
      .setOrigin(0.5, 0)
      .setAngle(90)
      .setDepth(12);

    this.statusText = this.add.text(width / 2, 80, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5).setScrollFactor(0);

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
      if (target.data.type === 2 || target.data.type === 3) {
        this.showRarityBanner(target.data.type);
      }
      if (this.hook.caughtFish.length >= this.hook.maxFishes) {
        this.hook.startRise();
      }
    });

    this.createHud();
    this.updateStatus();
  }

  update(_: number, delta: number): void {
    const deltaSeconds = delta / 1000;
    this.hook.update(deltaSeconds);
    this.updateCaughtFish();
    this.recycleOffscreenFish();
    this.updateCamera();
    this.updateRope();
    this.updateHud();

    this.energyTimer += delta;
    if (this.energyTimer >= 1000) {
      const restored = applyEnergyRegen();
      if (restored > 0) {
        this.updateStatus();
      }
      this.energyTimer = 0;
    }
  }

  private tryStartRun(): void {
    if (this.hook.state !== 'idle') return;
    if (!hasEnergy()) {
      this.flashStatus(t('Energy_warning', 'NOT ENOUGH ENERGY!'));
      return;
    }

    consumeEnergy();
    this.treasureCaught = false;
    this.hook.maxFishes = getUpgradeValue('maxFishes');
    const maxDepthUnits = getUpgradeValue('maxDepth');
    this.hook.maxDepthY = PHYSICS.waterSurfaceY + maxDepthUnits * PHYSICS.depthUnitPixels;

    this.hook.startDive(() => this.onRunFinished());
    this.spawnTimer?.remove(false);
    this.spawnTimer = this.time.addEvent({
      delay: GAMEPLAY.fishSpawnIntervalMs,
      loop: true,
      callback: () => this.spawnFish()
    });

    this.updateStatus();
  }

  private onRunFinished(): void {
    this.spawnTimer?.remove(false);
    this.spawnTimer = undefined;

    let totalValue = 0;
    const caughtIds = new Set(saveManager.data.caughtFishIds);
    const caughtCount = this.hook.caughtFish.length;
    for (const fish of this.hook.caughtFish) {
      if (fish.data.type === 4) {
        this.treasureCaught = true;
        continue;
      }
      totalValue += fish.data.price;
      if (!caughtIds.has(fish.data.id)) {
        caughtIds.add(fish.data.id);
      }
      ensureFishEarningOnCatch(fish.data);
    }

    const previousBest = saveManager.data.bestScore;
    const newBest = Math.max(previousBest, totalValue);
    saveManager.update({
      totalFishCaught: saveManager.data.totalFishCaught + caughtCount,
      caughtFishIds: Array.from(caughtIds),
      bestScore: newBest
    });
    void saveManager.save();

    this.clearCaughtFish();
    this.updateStatus();

    const payload: ScoreSceneData = {
      earnedCoins: totalValue,
      caughtCount,
      isNewRecord: totalValue > previousBest
    };

    if (this.treasureCaught) {
      this.scene.start('ChestScene', payload);
    } else {
      this.scene.start('ScoreScene', payload);
    }
  }

  private spawnFish(): void {
    if (this.hook.state !== 'diving') return;

    const depth = this.hook.y + Phaser.Math.Between(120, 420);
    if (!this.canSpawnAtDepth(depth)) return;

    const treasureRoll = Math.random();
    const treasure = treasureRoll < GAMEPLAY.treasureSpawnChance ? getRandomTreasureByDepth(depth) : null;
    const fishData = treasure ?? getRandomFishByDepth(depth);
    if (!fishData) return;

    const x = Phaser.Math.Between(80, this.scale.width - 80);
    const fishFrame = getFirstFrame(fishData.spriteName);
    const fish = new Fish(this, x, depth, AssetKeys.atlases.main, fishFrame, fishData);
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
    const topBound = this.cameras.main.scrollY - 400;
    this.fishGroup.children.each((child) => {
      const fish = child as Fish;
      if (fish.caught) return;
      if (fish.x < leftBound || fish.x > rightBound || fish.y < topBound) {
        fish.destroy();
      }
    });
  }

  private canSpawnAtDepth(depth: number): boolean {
    let canSpawn = true;
    const minGap = GAMEPLAY.fishSpawnMinGap;
    this.fishGroup.children.each((child) => {
      const fish = child as Fish;
      if (fish.caught) return;
      if (Math.abs(fish.y - depth) < minGap) {
        canSpawn = false;
      }
    });
    return canSpawn;
  }

  private clearCaughtFish(): void {
    this.hook.caughtFish.forEach((fish) => fish.destroy());
    this.hook.caughtFish.length = 0;
  }

  private updateStatus(): void {
    if (!this.statusText) return;
    this.statusText.setText('');
  }

  private flashStatus(message: string): void {
    if (!this.statusText) return;
    this.statusText.setText(message);
    this.time.delayedCall(1200, () => this.updateStatus());
  }

  private showRarityBanner(type: number): void {
    const { width } = this.scale;
    const text = type === 3 ? t('Fish_legendary', 'LEGENDARY!') : t('Fish_rare', 'RARE!');
    const banner = this.add.container(width / 2, 220).setScrollFactor(0);
    const bg = this.add.image(0, 0, AssetKeys.atlases.main, getFirstFrame('spr_popupBackground')).setScale(0.45);
    const label = this.add.text(0, 0, text, {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);
    banner.add([bg, label]);
    banner.setAlpha(0);

    this.tweens.add({
      targets: banner,
      alpha: 1,
      y: 200,
      duration: 180,
      yoyo: true,
      hold: 600,
      onComplete: () => banner.destroy()
    });
  }

  private updateCamera(): void {
    const camera = this.cameras.main;
    const height = this.scale.height;
    let targetScrollY = 0;

    if (this.hook.state === 'diving' || this.hook.state === 'rising') {
      targetScrollY = Phaser.Math.Clamp(this.hook.y - height * 0.35, 0, this.worldHeight - height);
    }

    camera.scrollY = Phaser.Math.Linear(camera.scrollY, targetScrollY, 0.08);
  }

  private createHud(): void {
    const { width } = this.scale;
    const hudDepth = 2000;

    const topLine = this.add
      .tileSprite(width / 2, 20, width, 11, AssetKeys.atlases.main, getFirstFrame('spr_upperline2'))
      .setScrollFactor(0)
      .setDepth(hudDepth);

    const coinBg = this.add.image(90, 60, AssetKeys.atlases.main, getFirstFrame('spr_coinBg'))
      .setScale(0.85)
      .setScrollFactor(0)
      .setDepth(hudDepth);
    this.add.image(coinBg.x - 48, coinBg.y, AssetKeys.atlases.main, getFirstFrame('spr_coin'))
      .setScale(0.8)
      .setScrollFactor(0)
      .setDepth(hudDepth + 1);
    this.coinText = this.add.text(coinBg.x - 12, coinBg.y, '$0', {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(hudDepth + 1);

    const depthFrames = getFrames('spr_levelBar');
    const depthBgFrame = depthFrames[0] ?? getFirstFrame('spr_levelBar');
    const depthFillFrame = depthFrames[1] ?? depthBgFrame;
    const depthBg = this.add.image(width / 2, 60, AssetKeys.atlases.main, depthBgFrame)
      .setScale(0.9)
      .setScrollFactor(0)
      .setDepth(hudDepth);
    this.depthFill = this.add.image(depthBg.x, depthBg.y, AssetKeys.atlases.main, depthFillFrame)
      .setScale(0.9)
      .setScrollFactor(0)
      .setDepth(hudDepth + 1);
    this.depthMask = this.add.graphics().setVisible(false).setScrollFactor(0);
    this.depthFill.setMask(this.depthMask.createGeometryMask());
    this.depthText = this.add.text(depthBg.x, depthBg.y, `0${t('Depth_upgrade_meters_small', 'm')}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(hudDepth + 2);

    const energyFrames = getFrames('spr_energyBar');
    const energyBgFrame = energyFrames[0] ?? getFirstFrame('spr_energyBar');
    const energyFillFrame = energyFrames[1] ?? energyBgFrame;
    const energyBg = this.add.image(width - 90, 60, AssetKeys.atlases.main, energyBgFrame)
      .setScale(0.95)
      .setScrollFactor(0)
      .setDepth(hudDepth);
    this.energyFill = this.add.image(energyBg.x, energyBg.y, AssetKeys.atlases.main, energyFillFrame)
      .setScale(0.95)
      .setScrollFactor(0)
      .setDepth(hudDepth + 1);
    this.energyMask = this.add.graphics().setVisible(false).setScrollFactor(0);
    this.energyFill.setMask(this.energyMask.createGeometryMask());
    this.energySpark = this.add.image(energyBg.x + energyBg.displayWidth / 2 - 8, energyBg.y, AssetKeys.atlases.main, getFirstFrame('spr_energySpark'))
      .setScale(0.9)
      .setScrollFactor(0)
      .setDepth(hudDepth + 2);

    topLine.setDepth(hudDepth + 3);
  }

  private updateHud(): void {
    if (this.wave) {
      this.wave.tilePositionX += 0.2;
    }

    if (this.coinText) {
      this.coinText.setText(`$${saveManager.data.coins}`);
    }

    if (this.energyFill && this.energyMask) {
      const ratio = Phaser.Math.Clamp(saveManager.data.energy / ENERGY_CONFIG.maxEnergy, 0, 1);
      const width = this.energyFill.displayWidth;
      const height = this.energyFill.displayHeight;
      const left = this.energyFill.x - width / 2;
      const top = this.energyFill.y - height / 2;
      this.energyMask.clear();
      this.energyMask.fillStyle(0xffffff, 1);
      this.energyMask.fillRect(left, top, width * ratio, height);

      if (this.energySpark) {
        this.energySpark.x = left + width * ratio;
        this.energySpark.setVisible(ratio > 0);
      }
    }

    if (this.depthFill && this.depthMask && this.depthText) {
      const maxDepth = Math.max(1, this.hook.maxDepthY - PHYSICS.waterSurfaceY);
      const currentDepth = Math.max(0, this.hook.y - PHYSICS.waterSurfaceY);
      const ratio = Phaser.Math.Clamp(currentDepth / maxDepth, 0, 1);
      const width = this.depthFill.displayWidth;
      const height = this.depthFill.displayHeight;
      const left = this.depthFill.x - width / 2;
      const top = this.depthFill.y - height / 2;
      this.depthMask.clear();
      this.depthMask.fillStyle(0xffffff, 1);
      this.depthMask.fillRect(left, top, width * ratio, height);

      const depthUnits = currentDepth / PHYSICS.depthUnitPixels;
      this.depthText.setText(`${Math.floor(depthUnits)}${t('Depth_upgrade_meters_small', 'm')}`);
    }
  }

  private updateRope(): void {
    if (!this.rope) return;
    const ropeLength = Math.max(0, this.hook.y - PHYSICS.waterSurfaceY);
    this.rope.setPosition(this.hook.x, PHYSICS.waterSurfaceY);
    this.rope.setDisplaySize(ropeLength, 9);
  }

}
