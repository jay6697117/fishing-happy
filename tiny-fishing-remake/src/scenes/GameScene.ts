import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { GAMEPLAY, PHYSICS } from '@/config/GameConstants';
import { getRandomFishByDepth, getRandomTreasureByDepth } from '@/config/FishDatabase';
import { getHookById } from '@/config/HookDatabase';
import { getFirstFrame } from '@/config/SpriteFrames';
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
  private runEarnings = 0;
  private energyTimer = 0;
  private treasureCaught = false;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.fishGroup = this.physics.add.group();

    const hookData = getHookById(saveManager.data.hookChosenId) ?? getHookById(1);
    const hookFrame = hookData ? getFirstFrame(hookData.spriteName) : 'unknown';
    const hookSize = hookData?.sizeY ?? 120;
    this.hook = new Hook(this, width / 2, PHYSICS.waterSurfaceY, AssetKeys.atlases.main, hookFrame, hookSize);
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
      if (target.data.type === 2 || target.data.type === 3) {
        this.showRarityBanner(target.data.type);
      }
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
    this.runEarnings = 0;
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

    this.runEarnings = totalValue;
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
    this.fishGroup.children.each((child) => {
      const fish = child as Fish;
      if (fish.caught) return;
      if (fish.x < leftBound || fish.x > rightBound) {
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

  private showRarityBanner(type: number): void {
    const { width } = this.scale;
    const text = type === 3 ? t('Fish_legendary', 'LEGENDARY!') : t('Fish_rare', 'RARE!');
    const banner = this.add.container(width / 2, 220);
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

}
