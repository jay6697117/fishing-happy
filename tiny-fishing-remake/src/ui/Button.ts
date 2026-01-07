import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void) {
    super(scene, x, y);

    this.background = scene.add
      .rectangle(0, 0, 260, 64, 0x1565c0, 0.9)
      .setStrokeStyle(4, 0xffffff, 1);

    this.label = scene.add
      .text(0, 0, text, {
        fontFamily: 'Trebuchet MS',
        fontSize: '28px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.add([this.background, this.label]);
    this.setSize(260, 64);
    this.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => onClick())
      .on('pointerover', () => this.background.setFillStyle(0x1e88e5, 1))
      .on('pointerout', () => this.background.setFillStyle(0x1565c0, 0.9));

    scene.add.existing(this);
  }
}
