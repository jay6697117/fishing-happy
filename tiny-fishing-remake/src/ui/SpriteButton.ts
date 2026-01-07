import Phaser from 'phaser';

interface SpriteButtonOptions {
  scale?: number;
  fontSize?: string;
  textColor?: string;
  hoverTint?: number;
}

export class SpriteButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private label: Phaser.GameObjects.Text;
  private hitArea: Phaser.Geom.Rectangle;
  private hoverTint: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureKey: string,
    frameName: string,
    text: string,
    onClick: () => void,
    options: SpriteButtonOptions = {}
  ) {
    super(scene, x, y);

    this.background = scene.add.image(0, 0, textureKey, frameName);
    const scale = options.scale ?? 1;
    this.background.setScale(scale);

    this.hoverTint = options.hoverTint ?? 0xfef3c7;

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

  setEnabled(enabled: boolean): void {
    this.setAlpha(enabled ? 1 : 0.6);
    if (enabled) {
      this.setInteractive({ hitArea: this.hitArea, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });
    } else {
      this.disableInteractive();
    }
  }
}
