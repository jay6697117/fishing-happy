import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { getFirstFrame } from '@/config/SpriteFrames';
import { saveManager } from '@/systems/SaveManager';
import { createRewardAdService, type RewardAdService } from '@/systems/RewardAdService';
import { t } from '@/systems/Localization';
import { Button } from '@/ui/Button';
import type { ScoreSceneData } from '@/scenes/ScoreScene';

export class ChestScene extends Phaser.Scene {
  private rewardAdService?: RewardAdService;
  private messageText?: Phaser.GameObjects.Text;
  private handled = false;

  constructor() {
    super('ChestScene');
  }

  create(data: ScoreSceneData): void {
    const { width, height } = this.scale;
    this.rewardAdService = createRewardAdService();

    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    const panel = this.add.image(width / 2, height / 2, AssetKeys.atlases.main, getFirstFrame('spr_chestui')).setScale(0.85);
    this.add.image(width / 2, panel.y - 30, AssetKeys.atlases.main, getFirstFrame('spr_treasure_chest')).setScale(0.7);

    this.add.text(width / 2, panel.y - panel.displayHeight / 2 + 50, t('Treasure_found', 'TREASURE FOUND'), {
      fontFamily: 'Trebuchet MS',
      fontSize: '24px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.add.text(width / 2, panel.y - panel.displayHeight / 2 + 90, t('Chest', 'CHEST!'), {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.messageText = this.add.text(width / 2, panel.y + 60, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0.5);

    new Button(this, width / 2, height - 200, t('Open_chest', 'OPEN'), () => {
      this.applyChestReward(1, data);
    }, { frameName: 'spr_butOrange', scale: 0.75, fontSize: '22px' });

    new Button(this, width / 2, height - 135, t('Open_for_ad_msg', 'WATCH AD').trim(), () => {
      void this.applyChestRewardWithAd(data);
    }, { frameName: 'spr_butOrangeSmall', scale: 0.7, fontSize: '18px' });

    new Button(this, width / 2, height - 80, t('No_thanks', 'NO, THANKS'), () => {
      this.scene.start('ScoreScene', data);
    }, { frameName: 'spr_butDark', scale: 0.65, fontSize: '18px' });
  }

  private applyChestReward(multiplier: number, data: ScoreSceneData): void {
    if (this.handled) return;
    this.handled = true;
    const save = saveManager.data;
    const addedKeys = multiplier;
    saveManager.update({ prizeKeys: save.prizeKeys + addedKeys });
    void saveManager.save();
    this.messageText?.setText(`+${addedKeys} KEYS`);
    this.time.delayedCall(700, () => this.scene.start('ScoreScene', data));
  }

  private async applyChestRewardWithAd(data: ScoreSceneData): Promise<void> {
    if (this.handled) return;
    if (!this.rewardAdService || !this.rewardAdService.isAvailable()) {
      this.applyChestReward(1, data);
      return;
    }
    const result = await this.rewardAdService.showRewardedAd();
    const multiplier = result.completed ? 2 : 1;
    this.applyChestReward(multiplier, data);
  }
}
