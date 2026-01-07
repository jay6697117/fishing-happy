import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { getHookById } from '@/config/HookDatabase';
import { getFirstFrame } from '@/config/SpriteFrames';
import { saveManager } from '@/systems/SaveManager';
import { applyPrize, applyPrizeTimer, consumePrizeKey, createPrizePool, formatPrize, type PrizeItem } from '@/systems/PrizeSystem';
import { Button } from '@/ui/Button';

export class PrizesScene extends Phaser.Scene {
  private prizePool: PrizeItem[] = [];
  private opened = new Set<number>();
  private keysText?: Phaser.GameObjects.Text;
  private hintText?: Phaser.GameObjects.Text;

  constructor() {
    super('PrizesScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    applyPrizeTimer();
    void saveManager.save();

    this.add.text(width / 2, 120, 'PRIZES', {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.keysText = this.add.text(width / 2, 180, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.hintText = this.add.text(width / 2, 220, 'TAP TO OPEN', {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.prizePool = createPrizePool();
    this.renderGrid();
    this.refreshKeys();

    const bestPrize = saveManager.data.bestPrize;
    if (bestPrize) {
      this.add.text(width / 2, height - 180, `BEST: ${bestPrize.type.toUpperCase()} ${bestPrize.value}`, {
        fontFamily: 'Trebuchet MS',
        fontSize: '20px',
        color: '#0f172a'
      }).setOrigin(0.5);
    }

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    });
  }

  private renderGrid(): void {
    const { width } = this.scale;
    const gridTop = 300;
    const cellSize = 170;
    const bgFrame = getFirstFrame('spr_prizeBg');

    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const index = row * 3 + col;
        const x = width / 2 + (col - 1) * cellSize;
        const y = gridTop + row * cellSize;

        const card = this.add.container(x, y);
        const bg = this.add.image(0, 0, AssetKeys.atlases.main, bgFrame).setScale(0.6);
        const label = this.add.text(0, 0, 'OPEN', {
          fontFamily: 'Trebuchet MS',
          fontSize: '18px',
          color: '#0f172a'
        }).setOrigin(0.5);

        card.add([bg, label]);
        card.setSize(bg.displayWidth, bg.displayHeight);
        card.setInteractive(new Phaser.Geom.Rectangle(-bg.displayWidth / 2, -bg.displayHeight / 2, bg.displayWidth, bg.displayHeight), Phaser.Geom.Rectangle.Contains);
        card.on('pointerdown', () => this.tryOpenPrize(index, card));
      }
    }
  }

  private tryOpenPrize(index: number, card: Phaser.GameObjects.Container): void {
    if (this.opened.has(index)) return;
    if (!consumePrizeKey()) {
      this.flashHint('NO KEYS');
      return;
    }

    const prize = this.prizePool[index];
    if (!prize) return;

    this.opened.add(index);
    applyPrize(prize);
    void saveManager.save();
    this.refreshKeys();

    card.removeAll(true);
    const bgFrame = getFirstFrame('spr_prizeBg');
    const bg = this.add.image(0, 0, AssetKeys.atlases.main, bgFrame).setScale(0.6);
    const icon = this.createPrizeIcon(prize);
    const label = this.add.text(0, 54, formatPrize(prize), {
      fontFamily: 'Trebuchet MS',
      fontSize: '16px',
      color: '#0f172a'
    }).setOrigin(0.5);

    card.add([bg, icon, label]);
  }

  private createPrizeIcon(prize: PrizeItem): Phaser.GameObjects.Image {
    let frameName = 'spr_prizeCoin';
    if (prize.type === 'coins') {
      frameName = 'spr_dolPrize';
    } else if (prize.type === 'hook') {
      const hook = getHookById(prize.value);
      frameName = hook?.spriteName ?? 'spr_prizeCoin';
    }

    const iconFrame = getFirstFrame(frameName);
    const icon = this.add.image(0, -10, AssetKeys.atlases.main, iconFrame).setScale(0.5);
    return icon;
  }

  private refreshKeys(): void {
    this.keysText?.setText(`KEYS: ${saveManager.data.prizeKeys}`);
  }

  private flashHint(text: string): void {
    if (!this.hintText) return;
    this.hintText.setText(text);
    this.time.delayedCall(1200, () => {
      this.hintText?.setText('TAP TO OPEN');
    });
  }
}
