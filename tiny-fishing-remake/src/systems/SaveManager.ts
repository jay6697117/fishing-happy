import localforage from 'localforage';
import { ENERGY_CONFIG, OFFLINE_CONFIG, UPGRADE_CONFIG } from '@/config/GameConstants';

export interface GameSave {
  maxFishesLevel: number;
  maxDepthLevel: number;
  earningPerMinLevel: number;

  coins: number;
  gems: number;
  energy: number;
  lastEnergyTimestamp: number;

  hookChosenId: number;
  unlockedHookIds: number[];

  caughtFishIds: number[];
  fishEarnings: Record<number, number>;

  bestScore: number;
  maxDepthReached: number;
  totalFishCaught: number;

  musicVolume: number;
  sfxVolume: number;
  language: string;

  prizeKeys: number;
  lastPrizeTimestamp: number;
  bestPrize: PrizeRecord | null;

  lastPlayedTimestamp: number;
}

export interface PrizeRecord {
  type: 'hook' | 'gems' | 'coins';
  value: number;
}

const DEFAULT_SAVE: GameSave = {
  maxFishesLevel: 0,
  maxDepthLevel: 0,
  earningPerMinLevel: 0,

  coins: 0,
  gems: 0,
  energy: ENERGY_CONFIG.defaultEnergy,
  lastEnergyTimestamp: Date.now(),

  hookChosenId: 1,
  unlockedHookIds: [1],

  caughtFishIds: [],
  fishEarnings: {},

  bestScore: 0,
  maxDepthReached: 0,
  totalFishCaught: 0,

  musicVolume: 0.5,
  sfxVolume: 1.0,
  language: 'en',

  prizeKeys: 0,
  lastPrizeTimestamp: Date.now(),
  bestPrize: null,

  lastPlayedTimestamp: Date.now()
};

class SaveManager {
  private static instance: SaveManager;
  private readonly saveKey = 'tiny-fishing-save';
  private currentSave: GameSave = { ...DEFAULT_SAVE };

  private constructor() {
    localforage.config({
      driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
      name: 'TinyFishing',
      storeName: 'gamedata'
    });
  }

  static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  async load(): Promise<GameSave> {
    try {
      const saved = await localforage.getItem<GameSave>(this.saveKey);
      if (saved) {
        this.currentSave = { ...DEFAULT_SAVE, ...saved };
      }
    } catch (error) {
      console.error('Failed to load save:', error);
    }
    return this.currentSave;
  }

  async save(): Promise<void> {
    this.currentSave.lastPlayedTimestamp = Date.now();
    try {
      await localforage.setItem(this.saveKey, this.currentSave);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }

  get data(): GameSave {
    return this.currentSave;
  }

  update(partial: Partial<GameSave>): void {
    this.currentSave = { ...this.currentSave, ...partial };
  }

  calculateOfflineEarnings(): number {
    const now = Date.now();
    const lastPlayed = this.currentSave.lastPlayedTimestamp;
    const minutesOffline = Math.floor((now - lastPlayed) / 60000);
    const cappedMinutes = Math.min(minutesOffline, OFFLINE_CONFIG.maxMinutes);
    const earningsPerMinute = UPGRADE_CONFIG.earnings.getValue(this.currentSave.earningPerMinLevel);
    return Math.floor(cappedMinutes * earningsPerMinute);
  }

  async reset(): Promise<void> {
    this.currentSave = { ...DEFAULT_SAVE };
    await this.save();
  }
}

export const saveManager = SaveManager.getInstance();
