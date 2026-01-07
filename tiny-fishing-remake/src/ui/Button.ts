import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { getFirstFrame } from '@/config/SpriteFrames';

interface ButtonOptions {
  frameName?: string;
  scale?: number;
  fontSize?: string;
  textColor?: string;
  hoverTint?: number;
}

export class Button extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private label: Phaser.GameObjects.Text;
  private hitArea: Phaser.Geom.Rectangle;
  private hoverTint: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    options: ButtonOptions = {}
  ) {
    super(scene, x, y);

    const frameName = getFirstFrame(options.frameName ?? 'spr_butOrange');
    const scale = options.scale ?? 0.75;
    this.hoverTint = options.hoverTint ?? 0xfef3c7;

    this.background = scene.add.image(0, 0, AssetKeys.atlases.main, frameName).setScale(scale);

    this.label = scene.add
      .text(0, 0, text, {
        fontFamily: 'Trebuchet MS',
        fontSize: options.fontSize ?? '22px',
        color: options.textColor ?? '#0f172a'
      })
      .setOrigin(0.5);

    this.add([this.background, this.label]);

    const bounds = this.background.getBounds();
    this.setSize(bounds.width, bounds.height);
    this.hitArea = new Phaser.Geom.Rectangle(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
    this.setInteractive({ hitArea: this.hitArea, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true })
      .on('pointerdown', () => onClick())
      .on('pointerover', () => this.background.setTint(this.hoverTint))
      .on('pointerout', () => this.background.clearTint());

    scene.add.existing(this);
  }
}
