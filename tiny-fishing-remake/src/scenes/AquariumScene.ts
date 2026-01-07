import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { AQUARIUM_CONFIG } from '@/config/GameConstants';
import { getFirstFrame, getFrames } from '@/config/SpriteFrames';
import { getFishById } from '@/config/FishDatabase';
import {
  applyAquariumEarnings,
  applyAquariumOfflineProgress,
  collectAllAquariumEarnings,
  getMaxEarningForFishType
} from '@/systems/AquariumSystem';
import { saveManager } from '@/systems/SaveManager';
import { createRewardAdService, type RewardAdService } from '@/systems/RewardAdService';
import { SpriteButton } from '@/ui/SpriteButton';

interface FishRow {
  fishId: number;
  maxStars: number;
  container: Phaser.GameObjects.Container;
  icon: Phaser.GameObjects.Image;
  stars: Phaser.GameObjects.Image[];
  earningText: Phaser.GameObjects.Text;
}

interface ListArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class AquariumScene extends Phaser.Scene {
  private rows: FishRow[] = [];
  private coinsText?: Phaser.GameObjects.Text;
  private fishCountText?: Phaser.GameObjects.Text;
  private earningsText?: Phaser.GameObjects.Text;
  private listContainer?: Phaser.GameObjects.Container;
  private listArea?: ListArea;
  private listScrollY = 0;
  private listScrollMin = 0;
  private listScrollMax = 0;
  private isDraggingList = false;
  private dragStartY = 0;
  private dragStartScroll = 0;
  private waterTile?: Phaser.GameObjects.TileSprite;
  private rewardAdService?: RewardAdService;
  private handleListWheel = (
    pointer: Phaser.Input.Pointer,
    _gameObjects: unknown,
    _deltaX: number,
    deltaY: number
  ): void => {
    if (!this.listArea || !this.isPointerInListArea(pointer)) return;
    this.setListScroll(this.listScrollY - deltaY * 0.6);
  };
  private handleListPointerDown = (pointer: Phaser.Input.Pointer): void => {
    if (!this.listArea || !this.isPointerInListArea(pointer)) return;
    this.isDraggingList = true;
    this.dragStartY = pointer.y;
    this.dragStartScroll = this.listScrollY;
  };
  private handleListPointerUp = (): void => {
    this.isDraggingList = false;
  };
  private handleListPointerMove = (pointer: Phaser.Input.Pointer): void => {
    if (!this.isDraggingList) return;
    if (!pointer.isDown) {
      this.isDraggingList = false;
      return;
    }
    const delta = pointer.y - this.dragStartY;
    this.setListScroll(this.dragStartScroll + delta);
  };

  constructor() {
    super('AquariumScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.rows = [];
    this.isDraggingList = false;

    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    applyAquariumOfflineProgress();
    void saveManager.save();

    this.rewardAdService = createRewardAdService();

    this.add.text(width / 2, 110, 'AQUARIUM', {
      fontFamily: 'Trebuchet MS',
      fontSize: '52px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.renderSummaryRow();

    const listArea: ListArea = {
      x: width / 2,
      y: height / 2 + 40,
      width: Math.min(width * 0.9, 720),
      height: Math.min(height * 0.52, 720)
    };
    this.listArea = listArea;

    const waterFrame = getFirstFrame('spr_bgaqua');
    this.waterTile = this.add
      .tileSprite(listArea.x, listArea.y, listArea.width, listArea.height, AssetKeys.atlases.main, waterFrame)
      .setAlpha(0.85);

    this.listContainer = this.add.container(0, 0);
    const maskGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    maskGraphics.fillStyle(0xffffff, 1);
    maskGraphics.fillRect(listArea.x - listArea.width / 2, listArea.y - listArea.height / 2, listArea.width, listArea.height);
    const mask = maskGraphics.createGeometryMask();
    this.listContainer.setMask(mask);

    const contentHeight = this.renderFishList(listArea);
    this.configureListScrolling(listArea, contentHeight);
    this.bindListInput();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.unbindListInput());

    this.earningsText = this.add.text(width / 2, height - 260, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const buttonScale = 0.82;
    const claimY = height - 180;
    const backY = height - 80;
    const claimButton = new SpriteButton(
      this,
      width / 2 - 180,
      claimY,
      AssetKeys.atlases.main,
      getFirstFrame('spr_aquariumBut'),
      'CLAIM',
      () => this.claimAll(AQUARIUM_CONFIG.claimMultiplierDefault),
      { scale: buttonScale, fontSize: '20px', textColor: '#0f172a' }
    );

    const adButton = new SpriteButton(
      this,
      width / 2 + 180,
      claimY,
      AssetKeys.atlases.main,
      getFirstFrame('spr_aquariumBut'),
      'CLAIM x4',
      () => void this.claimWithAd(),
      { scale: buttonScale, fontSize: '20px', textColor: '#0f172a' }
    );

    const adIconFrame = getFirstFrame('spr_descAd');
    const adIcon = this.add
      .image(adButton.width / 2 - 18, -adButton.height / 2 + 18, AssetKeys.atlases.main, adIconFrame)
      .setScale(1);
    adButton.add(adIcon);

    const backButton = new SpriteButton(
      this,
      width / 2,
      backY,
      AssetKeys.atlases.main,
      getFirstFrame('spr_aquariumBut'),
      'BACK',
      () => {
        this.scene.start('MainMenuScene');
      },
      { scale: buttonScale, fontSize: '20px', textColor: '#0f172a' }
    );

    this.tweens.add({
      targets: [claimButton, adButton],
      scale: buttonScale * 1.03,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    this.tweens.add({
      targets: backButton,
      scale: buttonScale * 1.02,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    this.refreshSummary();
  }

  update(_: number, delta: number): void {
    if (this.waterTile) {
      this.waterTile.tilePositionY -= delta * 0.015;
    }

    if (applyAquariumEarnings(delta / 1000)) {
      this.refreshRows();
      this.refreshSummary();
    }
  }

  private renderSummaryRow(): void {
    const { width } = this.scale;
    const coinBgFrame = getFirstFrame('spr_coinBg');
    const coinFrame = getFirstFrame('spr_coin');
    const textFieldFrame = getFirstFrame('spr_textfield');
    const centerX = width / 2;
    const offset = Math.min(170, width * 0.24);
    const baseScale = width < 520 ? 0.75 : 0.9;
    const iconOffset = 60 * baseScale;
    const textOffset = 20 * baseScale;

    const coinBg = this.add.image(centerX - offset, 190, AssetKeys.atlases.main, coinBgFrame).setScale(baseScale);
    this.add.image(coinBg.x - iconOffset, coinBg.y, AssetKeys.atlases.main, coinFrame).setScale(baseScale * 0.85);
    this.coinsText = this.add.text(coinBg.x - textOffset, coinBg.y, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#0f172a'
    }).setOrigin(0, 0.5);

    const fishBg = this.add.image(centerX + offset, 190, AssetKeys.atlases.main, textFieldFrame).setScale(baseScale);
    this.fishCountText = this.add.text(fishBg.x - 70 * baseScale, fishBg.y, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#0f172a'
    }).setOrigin(0, 0.5);
  }

  private renderFishList(listArea: ListArea): number {
    const { width } = this.scale;
    const listContainer = this.listContainer;
    if (!listContainer) return 0;

    const fishIds = saveManager.data.caughtFishIds
      .map((fishId) => getFishById(fishId))
      .filter((fish): fish is NonNullable<typeof fish> => !!fish && fish.type !== 4);

    if (fishIds.length === 0) {
      const emptyText = this.add.text(listArea.x, listArea.y, 'NO FISH CAUGHT YET', {
        fontFamily: 'Trebuchet MS',
        fontSize: '22px',
        color: '#0f172a'
      }).setOrigin(0.5);
      listContainer.add(emptyText);
      return 0;
    }

    const columns = width < 560 ? 1 : 2;
    const gapX = 24;
    const gapY = 18;
    const cellWidth = columns === 1 ? listArea.width - 20 : (listArea.width - gapX) / columns - gapX;
    const cellHeight = 120;

    const startX = listArea.x - listArea.width / 2 + gapX + cellWidth / 2;
    const startY = listArea.y - listArea.height / 2 + gapY + cellHeight / 2;

    const starFrames = getFrames('spr_fishStarIcon');
    const filledStar = starFrames[0] ?? getFirstFrame('spr_fishStarIcon');
    const emptyStar = starFrames[1] ?? filledStar;
    const partialStar = starFrames[2] ?? filledStar;

    fishIds.forEach((fish, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + col * (cellWidth + gapX);
      const y = startY + row * (cellHeight + gapY);

      const rowContainer = this.add.container(x, y);
      const rowBg = this.add.image(0, 0, AssetKeys.atlases.main, getFirstFrame('spr_textfield'));
      rowBg.setDisplaySize(cellWidth, cellHeight);
      rowBg.setAlpha(0.9);

      const iconFrame = getFirstFrame(fish.spriteName);
      const icon = this.add.image(-cellWidth / 2 + 54, 2, AssetKeys.atlases.main, iconFrame).setScale(0.4);
      this.tweens.add({
        targets: icon,
        y: icon.y - 6,
        duration: 1200 + (index % 5) * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut'
      });

      const name = fish.spriteName.replace('spr_', '').toUpperCase();
      const nameText = this.add.text(-cellWidth / 2 + 110, -20, name, {
        fontFamily: 'Trebuchet MS',
        fontSize: '16px',
        color: '#0f172a'
      }).setOrigin(0, 0.5);

      const earningText = this.add.text(-cellWidth / 2 + 110, 18, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '14px',
        color: '#0f172a'
      }).setOrigin(0, 0.5);

      const maxStars = getMaxEarningForFishType(fish.type);
      const stars: Phaser.GameObjects.Image[] = [];
      const starScale = 0.45;
      const starStartX = cellWidth / 2 - 22 - (maxStars - 1) * 18;
      for (let i = 0; i < maxStars; i += 1) {
        const star = this.add.image(starStartX + i * 18, -8, AssetKeys.atlases.main, emptyStar).setScale(starScale);
        star.setData('baseScale', starScale);
        stars.push(star);
      }

      rowContainer.add([rowBg, icon, nameText, earningText, ...stars]);
      listContainer.add(rowContainer);

      const rowData: FishRow = { fishId: fish.id, maxStars, container: rowContainer, icon, stars, earningText };
      this.rows.push(rowData);
      this.updateRow(rowData, filledStar, emptyStar, partialStar);
    });

    const totalRows = Math.ceil(fishIds.length / columns);
    return totalRows * (cellHeight + gapY) + gapY;
  }

  private updateRow(row: FishRow, filledStar: string, emptyStar: string, partialStar: string): void {
    const earning = Number(saveManager.data.fishEarnings[row.fishId] ?? 0);
    row.earningText.setText(`EARNING: ${earning.toFixed(2)} / ${row.maxStars}`);

    row.stars.forEach((star, index) => {
      let state: 'empty' | 'partial' | 'filled' = 'empty';
      if (earning >= index + 1) {
        state = 'filled';
      } else if (earning > index) {
        state = 'partial';
      }
      this.applyStarState(star, state, filledStar, emptyStar, partialStar);
    });
  }

  private applyStarState(
    star: Phaser.GameObjects.Image,
    state: 'empty' | 'partial' | 'filled',
    filledStar: string,
    emptyStar: string,
    partialStar: string
  ): void {
    const prevState = star.getData('state') as string | undefined;
    if (prevState === state) return;

    star.setData('state', state);

    if (state === 'filled') {
      star.setFrame(filledStar);
      star.setAlpha(1);
      this.startStarPulse(star);
      return;
    }

    star.setFrame(state === 'partial' ? partialStar : emptyStar);
    this.stopStarPulse(star);
    star.setAlpha(state === 'partial' ? 0.85 : 0.55);
  }

  private startStarPulse(star: Phaser.GameObjects.Image): void {
    const existing = star.getData('pulseTween') as Phaser.Tweens.Tween | undefined;
    if (existing) return;

    const baseScale = (star.getData('baseScale') as number | undefined) ?? star.scale;
    const tween = this.tweens.add({
      targets: star,
      scale: baseScale * 1.15,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });
    star.setData('pulseTween', tween);
  }

  private stopStarPulse(star: Phaser.GameObjects.Image): void {
    const tween = star.getData('pulseTween') as Phaser.Tweens.Tween | undefined;
    if (tween) {
      tween.stop();
      this.tweens.remove(tween);
      star.setData('pulseTween', undefined);
    }
    const baseScale = (star.getData('baseScale') as number | undefined) ?? star.scale;
    star.setScale(baseScale);
  }

  private refreshRows(): void {
    const starFrames = getFrames('spr_fishStarIcon');
    const filledStar = starFrames[0] ?? getFirstFrame('spr_fishStarIcon');
    const emptyStar = starFrames[1] ?? filledStar;
    const partialStar = starFrames[2] ?? filledStar;

    this.rows.forEach((row) => this.updateRow(row, filledStar, emptyStar, partialStar));
  }

  private refreshSummary(): void {
    const save = saveManager.data;
    const fishCount = save.caughtFishIds.filter((fishId) => {
      const fish = getFishById(fishId);
      return fish && fish.type !== 4;
    }).length;

    this.coinsText?.setText(`$${save.coins}`);
    this.fishCountText?.setText(`FISH: ${fishCount}`);
  }

  private claimAll(multiplier: number): void {
    const result = collectAllAquariumEarnings(multiplier);
    if (result.totalCoins > 0) {
      void saveManager.save();
      this.refreshRows();
      this.refreshSummary();
      this.earningsText?.setText(`CLAIMED: $${result.totalCoins}`);
    } else {
      this.earningsText?.setText('NO EARNINGS READY');
    }
  }

  private async claimWithAd(): Promise<void> {
    if (!this.rewardAdService || !this.rewardAdService.isAvailable()) {
      this.earningsText?.setText('AD NOT AVAILABLE');
      return;
    }

    this.earningsText?.setText('LOADING AD...');
    const result = await this.rewardAdService.showRewardedAd();
    if (result.completed) {
      this.claimAll(AQUARIUM_CONFIG.claimMultiplierBonus);
      return;
    }

    this.earningsText?.setText(result.message || 'AD NOT COMPLETED');
  }

  private configureListScrolling(listArea: ListArea, contentHeight: number): void {
    if (!this.listContainer) return;
    const maxScroll = 0;
    const minScroll = Math.min(0, listArea.height - contentHeight);

    this.listScrollMax = maxScroll;
    this.listScrollMin = minScroll;
    this.listScrollY = maxScroll;
    this.listContainer.y = this.listScrollY;
  }

  private bindListInput(): void {
    this.input.on('wheel', this.handleListWheel);
    this.input.on('pointerdown', this.handleListPointerDown);
    this.input.on('pointerup', this.handleListPointerUp);
    this.input.on('pointermove', this.handleListPointerMove);
  }

  private unbindListInput(): void {
    this.input.off('wheel', this.handleListWheel);
    this.input.off('pointerdown', this.handleListPointerDown);
    this.input.off('pointerup', this.handleListPointerUp);
    this.input.off('pointermove', this.handleListPointerMove);
  }

  private setListScroll(value: number): void {
    if (!this.listContainer) return;
    const clamped = Phaser.Math.Clamp(value, this.listScrollMin, this.listScrollMax);
    this.listScrollY = clamped;
    this.listContainer.y = clamped;
  }

  private isPointerInListArea(pointer: Phaser.Input.Pointer): boolean {
    if (!this.listArea) return false;
    return (
      pointer.x >= this.listArea.x - this.listArea.width / 2 &&
      pointer.x <= this.listArea.x + this.listArea.width / 2 &&
      pointer.y >= this.listArea.y - this.listArea.height / 2 &&
      pointer.y <= this.listArea.y + this.listArea.height / 2
    );
  }
}
