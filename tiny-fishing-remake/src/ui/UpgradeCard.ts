import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { getFirstFrame } from '@/config/SpriteFrames';

interface UpgradeCardOptions {
  iconFrame: string;
  title: string;
  valueText: string;
  priceText: string;
  scale?: number;
  onBuy?: () => void;
}

export class UpgradeCard extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private icon: Phaser.GameObjects.Image;
  private titleLabel: Phaser.GameObjects.Text;
  private valueLabel: Phaser.GameObjects.Text;
  private buyButton: Phaser.GameObjects.Container;
  private priceLabel: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    options: UpgradeCardOptions
  ) {
    super(scene, x, y);

    const scale = options.scale ?? 0.85;

    // 卡片背景
    this.background = scene.add
      .image(0, 0, AssetKeys.atlases.main, getFirstFrame('spr_upgradBG'))
      .setScale(scale);

    // 图标
    this.icon = scene.add
      .image(-this.background.displayWidth * 0.3, -20, AssetKeys.atlases.main, getFirstFrame(options.iconFrame))
      .setScale(0.6);

    // 标题
    this.titleLabel = scene.add
      .text(0, -this.background.displayHeight * 0.32, options.title, {
        fontFamily: 'Trebuchet MS',
        fontSize: '12px',
        color: '#64748b'
      })
      .setOrigin(0.5);

    // 数值显示
    this.valueLabel = scene.add
      .text(20, -10, options.valueText, {
        fontFamily: 'Trebuchet MS',
        fontSize: '20px',
        color: '#0f172a',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    // 购买按钮容器
    this.buyButton = scene.add.container(0, this.background.displayHeight * 0.28);
    const buyBg = scene.add
      .image(0, 0, AssetKeys.atlases.main, getFirstFrame('spr_upgradButton'))
      .setScale(scale * 0.85);
    const coinIcon = scene.add
      .image(-25, 0, AssetKeys.atlases.main, getFirstFrame('spr_coin'))
      .setScale(0.4);
    this.priceLabel = scene.add
      .text(10, 0, options.priceText, {
        fontFamily: 'Trebuchet MS',
        fontSize: '16px',
        color: '#0f172a'
      })
      .setOrigin(0.5);

    this.buyButton.add([buyBg, coinIcon, this.priceLabel]);

    // 购买按钮点击事件
    if (options.onBuy) {
      const bounds = buyBg.getBounds();
      const hitArea = new Phaser.Geom.Rectangle(
        -bounds.width / 2,
        -bounds.height / 2,
        bounds.width,
        bounds.height
      );
      this.buyButton
        .setSize(bounds.width, bounds.height)
        .setInteractive({
          hitArea,
          hitAreaCallback: Phaser.Geom.Rectangle.Contains,
          useHandCursor: true
        })
        .on('pointerdown', () => options.onBuy?.())
        .on('pointerover', () => buyBg.setTint(0xfef3c7))
        .on('pointerout', () => buyBg.clearTint());
    }

    this.add([this.background, this.icon, this.titleLabel, this.valueLabel, this.buyButton]);
    scene.add.existing(this);
  }

  updateValue(text: string): void {
    this.valueLabel.setText(text);
  }

  updatePrice(text: string): void {
    this.priceLabel.setText(text);
  }

  setEnabled(enabled: boolean): void {
    this.buyButton.setAlpha(enabled ? 1 : 0.5);
    if (enabled) {
      this.buyButton.setInteractive();
    } else {
      this.buyButton.disableInteractive();
    }
  }
}
