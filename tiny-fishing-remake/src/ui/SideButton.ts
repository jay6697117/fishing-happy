import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { getFirstFrame } from '@/config/SpriteFrames';

interface SideButtonOptions {
  leftSide?: boolean;
  backgroundFrame?: string;
  labelFrame?: string;
  scale?: number;
  iconScale?: number;
  labelOffset?: number;
  textColor?: string;
  fontSize?: string;
}

export class SideButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private icon: Phaser.GameObjects.Image;
  private labelBg?: Phaser.GameObjects.Image;
  private labelText?: Phaser.GameObjects.Text;
  private warningIcon?: Phaser.GameObjects.Image;
  private hitArea: Phaser.Geom.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    iconFrameName: string,
    label: string,
    onClick: () => void,
    options: SideButtonOptions = {}
  ) {
    super(scene, x, y);

    const backgroundFrame = getFirstFrame(options.backgroundFrame ?? 'spr_sbBgWhite');
    const labelFrame = getFirstFrame(options.labelFrame ?? 'spr_buttonDesc');
    const scale = options.scale ?? 0.9;
    const iconScale = options.iconScale ?? 0.7;
    const leftSide = options.leftSide ?? true;

    this.background = scene.add.image(0, 0, AssetKeys.atlases.main, backgroundFrame).setScale(scale);
    this.icon = scene.add.image(0, 0, AssetKeys.atlases.main, getFirstFrame(iconFrameName)).setScale(iconScale);

    this.add([this.background, this.icon]);

    if (label) {
      this.labelBg = scene.add.image(0, 0, AssetKeys.atlases.main, labelFrame).setScale(0.9);
      this.labelText = scene.add.text(0, 0, label, {
        fontFamily: 'Trebuchet MS',
        fontSize: options.fontSize ?? '16px',
        color: options.textColor ?? '#0f172a'
      }).setOrigin(0.5);

      const direction = leftSide ? 1 : -1;
      const offset = options.labelOffset ?? this.background.displayWidth * 0.75;
      const labelX = direction * offset;
      this.labelBg.setPosition(labelX, 0);
      this.labelText.setPosition(labelX, 0);
      this.add([this.labelBg, this.labelText]);
    }

    this.warningIcon = scene.add
      .image(this.background.displayWidth * 0.3, -this.background.displayHeight * 0.3, AssetKeys.atlases.main, getFirstFrame('spr_sbWarning'))
      .setScale(0.6)
      .setVisible(false);
    this.add(this.warningIcon);

    const bounds = this.background.getBounds();
    this.setSize(bounds.width, bounds.height);
    this.hitArea = new Phaser.Geom.Rectangle(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
    this.setInteractive({ hitArea: this.hitArea, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true })
      .on('pointerdown', () => onClick())
      .on('pointerover', () => this.background.setTint(0xfef3c7))
      .on('pointerout', () => this.background.clearTint());

    scene.add.existing(this);
  }

  setWarning(visible: boolean): void {
    if (!this.warningIcon) return;
    this.warningIcon.setVisible(visible);
  }
}
