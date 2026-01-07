import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { getFirstFrame, getFrames } from '@/config/SpriteFrames';
import { saveManager } from '@/systems/SaveManager';
import { createRewardAdService, type RewardAdService } from '@/systems/RewardAdService';
import { t } from '@/systems/Localization';
import { Button } from '@/ui/Button';

export interface ScoreSceneData {
  earnedCoins: number;
  caughtCount: number;
  isNewRecord: boolean;
}

export class ScoreScene extends Phaser.Scene {
  private rewardAdService?: RewardAdService;
  private claimed = false;

  constructor() {
    super('ScoreScene');
  }

  create(data: ScoreSceneData): void {
    const { width, height } = this.scale;
    this.rewardAdService = createRewardAdService();

    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    const panel = this.add.image(width / 2, height / 2, AssetKeys.atlases.main, getFirstFrame('spr_popupBackground')).setScale(0.85);

    this.add.text(width / 2, panel.y - panel.displayHeight / 2 + 40, t('Score_title', 'YOUR SCORE'), {
      fontFamily: 'Trebuchet MS',
      fontSize: '28px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.add.text(width / 2, panel.y - 40, `${t('Your_score', 'SCORE')}: $${data.earnedCoins}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '26px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.add.text(width / 2, panel.y - 5, `${t('Best_result', 'BEST')}: $${saveManager.data.bestScore}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const stars = this.calculateStars(data.earnedCoins);
    const starFrames = getFrames('spr_fishStarIcon');
    const emptyFrame = starFrames[0] ?? getFirstFrame('spr_fishStarIcon');
    const fullFrame = starFrames[2] ?? emptyFrame;
    const starY = panel.y + 10;
    const starGap = 70;
    for (let i = 0; i < 3; i += 1) {
      const frame = i < stars ? fullFrame : emptyFrame;
      this.add.image(width / 2 + (i - 1) * starGap, starY, AssetKeys.atlases.main, frame).setScale(0.8);
    }

    if (data.isNewRecord) {
      this.add.text(width / 2, panel.y + 70, t('New_record', 'NEW RECORD!').trim(), {
        fontFamily: 'Trebuchet MS',
        fontSize: '20px',
        color: '#0f172a'
      }).setOrigin(0.5);
    }

    new Button(this, width / 2, height - 180, t('Claim', 'CLAIM'), () => {
      this.applyClaim(data.earnedCoins, 1);
    }, { frameName: 'spr_butOrange', scale: 0.75, fontSize: '22px' });

    new Button(this, width / 2, height - 110, `${t('Claim', 'CLAIM')} x2`, () => {
      void this.claimWithAd(data.earnedCoins);
    }, { frameName: 'spr_butOrangeSmall', scale: 0.7, fontSize: '18px' });
  }

  private calculateStars(earnedCoins: number): number {
    const best = Math.max(1, saveManager.data.bestScore);
    if (earnedCoins >= best) return 3;
    if (earnedCoins >= best * 0.7) return 2;
    if (earnedCoins > 0) return 1;
    return 0;
  }

  private applyClaim(earnedCoins: number, multiplier: number): void {
    if (this.claimed) return;
    this.claimed = true;
    const coins = saveManager.data.coins + earnedCoins * multiplier;
    saveManager.update({ coins });
    void saveManager.save();
    this.scene.start('MainMenuScene');
  }

  private async claimWithAd(earnedCoins: number): Promise<void> {
    if (this.claimed) return;
    if (!this.rewardAdService || !this.rewardAdService.isAvailable()) {
      this.applyClaim(earnedCoins, 1);
      return;
    }
    const result = await this.rewardAdService.showRewardedAd();
    if (result.completed) {
      this.applyClaim(earnedCoins, 2);
    } else {
      this.applyClaim(earnedCoins, 1);
    }
  }
}
