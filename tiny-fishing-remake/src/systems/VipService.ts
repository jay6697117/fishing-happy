import { FEATURE_FLAGS } from '@/config/FeatureFlags';

export interface VipOfferResult {
  accepted: boolean;
  message: string;
}

export interface VipService {
  isAvailable(): boolean;
  showVipOffer(): Promise<VipOfferResult>;
}

declare const wx: any;

class DisabledVipService implements VipService {
  isAvailable(): boolean {
    return false;
  }

  async showVipOffer(): Promise<VipOfferResult> {
    return { accepted: false, message: 'VIP DISABLED' };
  }
}

class WebVipService implements VipService {
  isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.confirm === 'function';
  }

  async showVipOffer(): Promise<VipOfferResult> {
    if (!this.isAvailable()) {
      return { accepted: false, message: 'VIP UNAVAILABLE' };
    }
    const accepted = window.confirm('Start VIP trial?');
    return {
      accepted,
      message: accepted ? 'VIP ACTIVATED' : 'VIP SKIPPED'
    };
  }
}

class WeChatVipService implements VipService {
  isAvailable(): boolean {
    return typeof wx !== 'undefined';
  }

  async showVipOffer(): Promise<VipOfferResult> {
    if (!this.isAvailable()) {
      return { accepted: false, message: 'VIP UNAVAILABLE' };
    }
    return { accepted: false, message: 'VIP STUB' };
  }
}

export function createVipService(): VipService {
  if (!FEATURE_FLAGS.enableVip) {
    return new DisabledVipService();
  }
  if (typeof wx !== 'undefined') {
    return new WeChatVipService();
  }
  return new WebVipService();
}
