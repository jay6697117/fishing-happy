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
  private topSurface?: Phaser.GameObjects.Container;
  private topDecor?: Phaser.GameObjects.Container;
  private fishCountIcon?: Phaser.GameObjects.Image;
  private fishCountText?: Phaser.GameObjects.Text;
  private fishCountBg?: Phaser.GameObjects.Image;
  private fishCountFill?: Phaser.GameObjects.Image;
  private fishCountMask?: Phaser.GameObjects.Graphics;
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

    this.createSurfaceScene();

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

  private createSurfaceScene(): void {
    const { width } = this.scale;
    const surfaceY = PHYSICS.waterSurfaceY;

    const topSurface = this.add.container(width / 2, surfaceY - 40).setDepth(6);
    const plank = this.add.image(0, 0, AssetKeys.atlases.main, getFirstFrame('spr_upperPlank'));
    plank.setScale(width / plank.width, 1.1);

    const line = this.add.tileSprite(0, -plank.displayHeight / 2 + 18, width, 23, AssetKeys.atlases.main, getFirstFrame('spr_upperLine'));
    line.setCrop(0, 0, line.displayWidth, 23);

    const moneyBg = this.add.image(-width * 0.32, -2, AssetKeys.atlases.main, getFirstFrame('spr_upperMoney'));
    moneyBg.setScale(0.78);
    const moneyIcon = this.add.image(moneyBg.x - 70, moneyBg.y + 4, AssetKeys.atlases.main, getFirstFrame('spr_coin'));
    moneyIcon.setScale(0.8);
    const moneyText = this.add.text(moneyBg.x - 20, moneyBg.y + 2, '$0', {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0, 0.5);
    this.coinText = moneyText;

    const depthBgFrame = getFrames('spr_levelBar')[0] ?? getFirstFrame('spr_levelBar');
    const depthFillFrame = getFrames('spr_levelBar')[1] ?? depthBgFrame;
    const depthBg = this.add.image(0, -2, AssetKeys.atlases.main, depthBgFrame).setScale(0.85);
    this.depthFill = this.add.image(depthBg.x, depthBg.y, AssetKeys.atlases.main, depthFillFrame).setScale(0.85);
    this.depthMask = this.add.graphics().setVisible(false);
    this.depthFill.setMask(this.depthMask.createGeometryMask());
    this.depthText = this.add.text(depthBg.x, depthBg.y + 1, `0${t('Depth_upgrade_meters_small', 'm')}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const energyFrames = getFrames('spr_energyBar');
    const energyBgFrame = energyFrames[0] ?? getFirstFrame('spr_energyBar');
    const energyFillFrame = energyFrames[1] ?? energyBgFrame;
    const energyBg = this.add.image(width * 0.32, -2, AssetKeys.atlases.main, energyBgFrame).setScale(0.95);
    this.energyFill = this.add.image(energyBg.x, energyBg.y, AssetKeys.atlases.main, energyFillFrame).setScale(0.95);
    this.energyMask = this.add.graphics().setVisible(false);
    this.energyFill.setMask(this.energyMask.createGeometryMask());
    this.energySpark = this.add.image(energyBg.x + energyBg.displayWidth / 2 - 8, energyBg.y, AssetKeys.atlases.main, getFirstFrame('spr_energySpark'))
      .setScale(0.9);

    const fishCountBg = this.add.image(width * 0.42, -6, AssetKeys.atlases.main, getFirstFrame('spr_levelIconBG'));
    fishCountBg.setScale(0.72);
    const fishCountFill = this.add.image(fishCountBg.x, fishCountBg.y, AssetKeys.atlases.main, getFrames('spr_levBar')[1] ?? getFirstFrame('spr_levBar'));
    fishCountFill.setScale(1.2, 1.1);
    this.fishCountMask = this.add.graphics().setVisible(false);
    fishCountFill.setMask(this.fishCountMask.createGeometryMask());
    const fishCountIcon = this.add.image(fishCountBg.x, fishCountBg.y - 24, AssetKeys.atlases.main, getFirstFrame('spr_fishes_icon'));
    fishCountIcon.setScale(0.42);
    const fishCountText = this.add.text(fishCountBg.x, fishCountBg.y + 22, '0/0', {
      fontFamily: 'Trebuchet MS',
      fontSize: '16px',
      color: '#0f172a'
    }).setOrigin(0.5);
    this.fishCountBg = fishCountBg;
    this.fishCountFill = fishCountFill;
    this.fishCountIcon = fishCountIcon;
    this.fishCountText = fishCountText;

    topSurface.add([
      plank,
      line,
      moneyBg,
      moneyIcon,
      moneyText,
      depthBg,
      this.depthFill,
      this.depthText,
      energyBg,
      this.energyFill,
      this.energySpark,
      fishCountBg,
      fishCountFill,
      fishCountIcon,
      fishCountText
    ]);
    this.topSurface = topSurface;

    const decor = this.add.container(0, surfaceY - 70).setDepth(7);
    const fisherman = this.add.image(width * 0.25, 0, AssetKeys.atlases.main, getFirstFrame('spr_fisherman'));
    fisherman.setScale(0.6).setOrigin(0.5, 1);
    const hand = this.add.image(width * 0.35, -40, AssetKeys.atlases.main, getFirstFrame('spr_fisherhand'));
    hand.setScale(0.65).setOrigin(0.5, 1);
    decor.add([fisherman, hand]);
    this.topDecor = decor;
  }

  private createHud(): void {
    const hudDepth = 2000;
    this.topSurface?.setScrollFactor(0).setDepth(hudDepth);
    this.topDecor?.setScrollFactor(0).setDepth(hudDepth + 1);
  }

  private updateHud(): void {
    if (this.wave) {
      this.wave.tilePositionX += 0.2;
    }

    if (this.coinText) {
      this.coinText.setText(`$${saveManager.data.coins}`);
    }

    if (this.fishCountText) {
      const current = this.hook.caughtFish.length;
      const max = this.hook.maxFishes;
      this.fishCountText.setText(`${current}/${max}`);
    }

    if (this.fishCountFill && this.fishCountMask) {
      const current = this.hook.caughtFish.length;
      const max = Math.max(1, this.hook.maxFishes);
      const ratio = Phaser.Math.Clamp(current / max, 0, 1);
      const width = this.fishCountFill.displayWidth;
      const height = this.fishCountFill.displayHeight;
      const left = this.fishCountFill.x - width / 2;
      const top = this.fishCountFill.y - height / 2;
      this.fishCountMask.clear();
      this.fishCountMask.fillStyle(0xffffff, 1);
      this.fishCountMask.fillRect(left, top, width * ratio, height);
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

    if (this.topDecor) {
      const bob = Math.sin(this.time.now / 600) * 2;
      this.topDecor.y = PHYSICS.waterSurfaceY - 70 + bob;
    }
  }

  private updateRope(): void {
    if (!this.rope) return;
    const ropeLength = Math.max(0, this.hook.y - PHYSICS.waterSurfaceY);
    this.rope.setPosition(this.hook.x, PHYSICS.waterSurfaceY);
    this.rope.setDisplaySize(ropeLength, 9);
  }

}
