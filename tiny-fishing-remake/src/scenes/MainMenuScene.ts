import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
import { SideButton } from '@/ui/SideButton';
import { applyEnergyRegen } from '@/systems/EnergySystem';
import { applyPrizeTimer } from '@/systems/PrizeSystem';
import { saveManager } from '@/systems/SaveManager';
import { getFirstFrame } from '@/config/SpriteFrames';
import { t } from '@/systems/Localization';
import { FEATURE_FLAGS } from '@/config/FeatureFlags';

interface MainMenuData {
  offlineEarnings?: number;
}

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(data: MainMenuData): void {
    const { width, height } = this.scale;
    applyEnergyRegen();
    applyPrizeTimer();
    void saveManager.save();

    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    const titleFrame = getFirstFrame('spr_tfcaption');
    this.add.image(width / 2, 150, AssetKeys.atlases.main, titleFrame).setScale(0.9);

    if (data.offlineEarnings && data.offlineEarnings > 0) {
      this.add.text(width / 2, 230, `${t('Earned_offline', 'EARNED OFFLINE')} +$${data.offlineEarnings}`, {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#0f172a'
      }).setOrigin(0.5);
    }

    const playButton = new Button(this, width / 2, height / 2 + 120, t('Play', 'PLAY'), () => {
      this.scene.start('GameScene');
    }, { frameName: 'spr_butOrange', scale: 0.85, fontSize: '28px' });
    const arrow = this.add.image(playButton.width / 2 - 32, 0, AssetKeys.atlases.main, getFirstFrame('spr_playButArrow'));
    playButton.add(arrow);

    this.add.text(width / 2, playButton.y + 80, t('Tap_to_start_playing', 'TAP TO START PLAYING'), {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const leftX = width / 2 - 230;
    const rightX = width / 2 + 230;
    const topY = height / 2 - 140;
    const gap = 165;

    const leftButtons = [
      { icon: 'spr_upgMoney', label: t('Earnings', 'EARNINGS'), target: 'ShopScene', bg: 'spr_sbBgOrange' },
      { icon: 'spr_sbHooks', label: t('Hooks', 'HOOKS'), target: 'HooksScene', bg: 'spr_sbBgWhite' },
      { icon: 'spr_sbAqua', label: t('Aquarium', 'AQUARIUM'), target: 'AquariumScene', bg: 'spr_sbBgWhite' }
    ];

    const rightButtons = [
      { icon: 'spr_sbPrize', label: 'PRIZES', target: 'PrizesScene', bg: 'spr_sbBgGold' },
      { icon: 'spr_energyRes', label: t('Do_smth_for_energy', 'ENERGY'), target: 'EnergyScene', bg: 'spr_sbBgWhite' },
      { icon: 'spr_settingsButton', label: t('Settings', 'SETTINGS'), target: 'SettingsScene', bg: 'spr_sbBgWhite' }
    ];

    leftButtons.forEach((entry, index) => {
      new SideButton(this, leftX, topY + gap * index, entry.icon, entry.label, () => {
        this.scene.start(entry.target);
      }, { leftSide: true, backgroundFrame: entry.bg, scale: 0.85, iconScale: 0.7 });
    });

    const prizeButton = new SideButton(this, rightX, topY, rightButtons[0].icon, rightButtons[0].label, () => {
      this.scene.start(rightButtons[0].target);
    }, { leftSide: false, backgroundFrame: rightButtons[0].bg, scale: 0.85, iconScale: 0.7 });
    prizeButton.setWarning(saveManager.data.prizeKeys > 0);

    const energyButton = new SideButton(this, rightX, topY + gap, rightButtons[1].icon, rightButtons[1].label, () => {
      this.scene.start(rightButtons[1].target);
    }, { leftSide: false, backgroundFrame: rightButtons[1].bg, scale: 0.85, iconScale: 0.7 });
    energyButton.setWarning(saveManager.data.energy <= 0);

    new SideButton(this, rightX, topY + gap * 2, rightButtons[2].icon, rightButtons[2].label, () => {
      this.scene.start(rightButtons[2].target);
    }, { leftSide: false, backgroundFrame: rightButtons[2].bg, scale: 0.85, iconScale: 0.7 });

    if (FEATURE_FLAGS.enableVip) {
      new SideButton(this, rightX, topY + gap * 3, 'spr_sbVip', t('Become_VIP', 'BECOME VIP'), () => {
        this.scene.start('VipScene');
      }, { leftSide: false, backgroundFrame: 'spr_sbBgOrange', scale: 0.85, iconScale: 0.7 });
    }

    const coins = saveManager.data.coins;
    const energy = saveManager.data.energy;
    const keys = saveManager.data.prizeKeys;
    const gems = saveManager.data.gems;
    this.add.text(width / 2, height - 80, `COINS: $${coins} | GEMS: ${gems} | ENERGY: ${energy} | KEYS: ${keys}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);
  }
}
