export interface RewardAdResult {
  completed: boolean;
  message: string;
}

export interface RewardAdService {
  isAvailable(): boolean;
  showRewardedAd(): Promise<RewardAdResult>;
}

declare const wx: any;

type AdCloseResult = { isEnded?: boolean } | undefined;

class WebRewardAdService implements RewardAdService {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.confirm === 'function';
  }

  async showRewardedAd(): Promise<RewardAdResult> {
    if (!this.isAvailable()) {
      return { completed: false, message: 'AD UNAVAILABLE' };
    }

    const accepted = window.confirm('Watch ad to claim x4?');
    return {
      completed: accepted,
      message: accepted ? 'AD COMPLETED' : 'AD SKIPPED'
    };
  }
}

class WeChatRewardAdService implements RewardAdService {
  private adUnitId: string;
  private adInstance?: any;
  private isShowing = false;

  constructor(adUnitId: string) {
    this.adUnitId = adUnitId;
  }

  isAvailable(): boolean {
    return !!this.adUnitId && typeof wx !== 'undefined' && typeof wx.createRewardedVideoAd === 'function';
  }

  async showRewardedAd(): Promise<RewardAdResult> {
    if (!this.isAvailable()) {
      return { completed: false, message: 'AD UNAVAILABLE' };
    }

    if (this.isShowing) {
      return { completed: false, message: 'AD BUSY' };
    }

    this.isShowing = true;

    if (!this.adInstance) {
      this.adInstance = wx.createRewardedVideoAd({ adUnitId: this.adUnitId });
    }

    const ad = this.adInstance;

    return new Promise<RewardAdResult>((resolve) => {
      let settled = false;
      const finalize = (result: RewardAdResult): void => {
        if (settled) return;
        settled = true;
        this.isShowing = false;
        resolve(result);
      };

      const handleClose = (result: AdCloseResult): void => {
        if (typeof ad.offClose === 'function') {
          ad.offClose(handleClose);
        }
        if (typeof ad.offError === 'function') {
          ad.offError(handleError);
        }

        const completed = result?.isEnded ?? true;
        finalize({ completed, message: completed ? 'AD COMPLETED' : 'AD SKIPPED' });
      };

      const handleError = (): void => {
        if (typeof ad.offClose === 'function') {
          ad.offClose(handleClose);
        }
        if (typeof ad.offError === 'function') {
          ad.offError(handleError);
        }

        finalize({ completed: false, message: 'AD ERROR' });
      };

      if (typeof ad.onClose === 'function') {
        ad.onClose(handleClose);
      }
      if (typeof ad.onError === 'function') {
        ad.onError(handleError);
      }

      Promise.resolve(ad.show())
        .catch(() => ad.load().then(() => ad.show()))
        .catch(() => handleError());
    });
  }
}

export function createRewardAdService(): RewardAdService {
  const adUnitId = import.meta.env.VITE_WECHAT_REWARD_AD_UNIT_ID || '';
  if (typeof wx !== 'undefined' && typeof wx.createRewardedVideoAd === 'function') {
    return new WeChatRewardAdService(adUnitId);
  }
  return new WebRewardAdService();
}
