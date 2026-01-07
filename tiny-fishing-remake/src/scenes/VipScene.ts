import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { getFirstFrame } from '@/config/SpriteFrames';
import { Button } from '@/ui/Button';
import { saveManager } from '@/systems/SaveManager';
import { createVipService, type VipService } from '@/systems/VipService';
import { t } from '@/systems/Localization';

export class VipScene extends Phaser.Scene {
  private vipService?: VipService;
  private statusText?: Phaser.GameObjects.Text;

  constructor() {
    super('VipScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.vipService = createVipService();

    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    const title = t('Become_VIP', 'BECOME VIP');
    this.add.text(width / 2, 120, title, {
      fontFamily: 'Trebuchet MS',
      fontSize: '44px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const panelFrame = getFirstFrame('spr_popupBackground');
    const panel = this.add.image(width / 2, height / 2 + 40, AssetKeys.atlases.main, panelFrame).setScale(0.85);

    const lines = [
      t('VIP_night_mode', 'VIP NIGHT MODE'),
      t('Exclusive_night_mode', 'EXCLUSIVE NIGHT MODE!'),
      t('No_ads', 'NO ADS'),
      t('All_money_x_2', 'ALL MONEY x2')
    ];

    const startY = panel.y - 120;
    lines.forEach((line, index) => {
      this.add.text(width / 2, startY + index * 44, line, {
        fontFamily: 'Trebuchet MS',
        fontSize: '20px',
        color: '#0f172a'
      }).setOrigin(0.5);
    });

    this.statusText = this.add.text(width / 2, panel.y + 120, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0.5);

    new Button(this, width / 2, height - 180, t('Start_free_trial', 'START FREE TRIAL'), () => {
      void this.tryActivateVip();
    }, { frameName: 'spr_butOrange', scale: 0.75 });

    new Button(this, width / 2, height - 100, t('No_thanks', 'NO, THANKS'), () => {
      this.scene.start('MainMenuScene');
    }, { frameName: 'spr_butDark', scale: 0.7 });

    this.refreshStatus();
  }

  private async tryActivateVip(): Promise<void> {
    if (!this.vipService || !this.vipService.isAvailable()) {
      this.flashStatus('VIP UNAVAILABLE');
      return;
    }

    const result = await this.vipService.showVipOffer();
    if (result.accepted) {
      saveManager.update({ vipActive: true });
      await saveManager.save();
      this.refreshStatus();
    } else {
      this.flashStatus(result.message);
    }
  }

  private refreshStatus(): void {
    const active = saveManager.data.vipActive;
    this.statusText?.setText(active ? 'VIP ACTIVE' : 'VIP INACTIVE');
  }

  private flashStatus(message: string): void {
    if (!this.statusText) return;
    this.statusText.setText(message);
    this.time.delayedCall(1200, () => this.refreshStatus());
  }
}
