# 🎣 TinyFishing 项目复刻计划 (完整版)

> 生成时间: 2026-01-06
> 原始项目路径: `/Users/zhangjinhui/Desktop/fishing-happy/TinyFishing`

---

## 一、原始项目深度分析

### 1.1 技术架构概览

| 属性 | 详情 |
|------|------|
| **原始引擎** | GameMaker Studio HTML5 导出 |
| **核心代码** | `TinyFishing.js` (102,398 行混淆 JS) |
| **项目大小** | 12MB |
| **渲染方式** | Canvas 2D |
| **存储方式** | localStorage |
| **本地化** | 英语/俄语 (CSV 格式) |

### 1.2 核心游戏机制 (逆向分析结果)

#### A. 升级系统公式

| 升级项 | 变量 | 数值公式 | 成本公式 |
|--------|------|----------|----------|
| **最大鱼数** | `maxFishes` | `3 + Level` | `50 × (1.5 ^ Level)` 取整到5 |
| **最大深度** | `maxDepth` | `3 + Level` (深度单位) | `50 × (1.5 ^ Level)` 取整到5 |
| **收益倍率** | `earnings` | `5 × (1.5 ^ Level)` | `50 × (1.5 ^ Level)` 取整到5 |

#### B. 鱼类数据系统

| 属性 | 详情 |
|------|------|
| **总鱼种** | 约29种 (普通/稀有/传说级) |
| **生成逻辑** | 根据当前深度范围 `[minDepth, maxDepth]` 动态生成 |
| **价值范围** | $10 (普通) ~ $7000+ (传说级) |
| **稀有度分布** | 普通(0.9) / 稀有(0.1) / 传说(0.03) |

**示例鱼类数据:**

| ID | 价格($) | 深度范围 | 稀有度 | 缩放比例 |
|:---|:--------|:---------|:-------|:---------|
| 1 | $10 | 0 - 4 | Common | 0.9 |
| 5 | $20 | 1 - 7 | Common | 0.15 |
| 12 | $100 | 1 - 5 | Rare | 0.1 |
| 29 | $7000+ | 22 - 27 | Legendary | 0.03 |

#### C. 游戏循环

```
点击开始 → 钩子下沉 → 鱼类碰撞检测(AABB) → 达到容量/深度限制 
→ 钩子上升 → 到达水面结算 → 金币增加 → 升级/解锁钩子
```

#### D. 存档系统

- **存储方式**: `window.localStorage`
- **存档数据**:
  - 升级等级 (`fishes_level`, `depth_level`, `earnings_level`)
  - 金币数量
  - 已解锁钩子皮肤
  - 最高分数 / 最大深度记录
  - 上次游戏时间戳 (用于离线收益计算)

### 1.3 资源清单

| 资源类型 | 数量 | 格式 | 说明 |
|----------|------|------|------|
| 纹理图集 | 5张 | PNG | TinyFishing_texture_0~4.png |
| 音效 | 22个 | OGG | 捕鱼、升级、按钮等 |
| 鱼类精灵 | 29种 | 内嵌 | spr_fish1 ~ spr_fish29 |
| 钩子皮肤 | 12种 | 内嵌 | spr_hook1 ~ spr_hook12 |
| 背景音乐 | 1首 | OGG | snd_musicBackground |
| 多语言 | 2种 | CSV | 英语/俄语 |

### 1.4 美术风格分析

| 维度 | 描述 |
|------|------|
| **整体风格** | 扁平化卡通矢量风格 (Flat Vector Art) |
| **色彩方案** | 高饱和度 (橙色、蓝色、绿色为主色调) |
| **角色设计** | 大胡子渔夫 (橙色夹克、紫色毛线帽、闭眼微笑) |
| **UI风格** | 圆角矩形、大字体、厚描边、清晰图标 |
| **动画特效** | 简单补间动画、粒子效果(水花、金币) |

---

## 二、推荐技术栈 (2025 最佳实践)

### 2.1 核心技术选型

| 层级 | 技术选择 | 版本 | 选择理由 |
|------|----------|------|----------|
| **游戏引擎** | Phaser 3 | ^3.87.0 | 最成熟的HTML5 2D游戏框架，内置Arcade物理、统一触控API |
| **开发语言** | TypeScript | ^5.4.0 | 类型安全、优秀IDE支持、易于重构 |
| **构建工具** | Vite | ^5.4.0 | 极速HMR、零配置TS支持、优秀生产构建 |
| **本地存储** | LocalForage | ^1.10.0 | IndexedDB优先、Promise API、自动降级 |
| **PWA支持** | vite-plugin-pwa | ^0.20.0 | 开箱即用、Workbox集成、离线缓存 |

### 2.2 引擎对比分析

| 引擎 | 最适场景 | 移动端支持 | TypeScript | 学习曲线 | 包大小 |
|------|----------|------------|------------|----------|--------|
| **Phaser 3** ⭐ | 完整游戏 | ⭐⭐⭐⭐⭐ | 原生支持 | 中等 | ~1MB |
| **PixiJS 8** | 自定义渲染 | ⭐⭐⭐⭐ | 原生支持 | 低 | ~300KB |
| **Cocos Creator** | 企业级 | ⭐⭐⭐⭐ | 原生支持 | 高 | ~2MB |
| **Godot HTML5** | 桌面优先 | ⭐⭐ | GDScript | 高 | ~20MB |

**选择 Phaser 3 的理由:**
1. 内置 Arcade 物理引擎 - 完美适配钓鱼线物理
2. 统一输入系统 - 鼠标/触摸自动兼容
3. 优秀的资源管理 - 带进度事件的加载器
4. 活跃生态 - 8,800+ 官方代码示例
5. 移动优先的 Scale Manager - 自动响应式缩放

### 2.3 package.json 依赖

```json
{
  "name": "tiny-fishing-remake",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "phaser": "^3.87.0",
    "localforage": "^1.10.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "typescript": "^5.4.0",
    "vite-plugin-pwa": "^0.20.0",
    "@rollup/plugin-replace": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

---

## 三、项目结构

```
tiny-fishing-remake/
├── public/
│   ├── assets/
│   │   ├── sprites/              # 纹理图集
│   │   │   ├── fish.png          # 鱼类精灵表
│   │   │   ├── fish.json         # 精灵表配置
│   │   │   ├── hooks.png         # 钩子皮肤
│   │   │   ├── hooks.json
│   │   │   ├── ui.png            # UI元素
│   │   │   ├── ui.json
│   │   │   ├── fisherman.png     # 渔夫角色
│   │   │   └── fisherman.json
│   │   ├── audio/                # 音效资源
│   │   │   ├── bgm.ogg           # 背景音乐
│   │   │   ├── catch.ogg         # 捕鱼音效
│   │   │   ├── splash.ogg        # 水花音效
│   │   │   ├── coin.ogg          # 金币音效
│   │   │   ├── upgrade.ogg       # 升级音效
│   │   │   └── button.ogg        # 按钮音效
│   │   └── fonts/                # 自定义字体
│   │       └── game-font.ttf
│   ├── favicon.ico
│   └── icons/                    # PWA 图标
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── main.ts                   # 应用入口
│   ├── config/
│   │   ├── GameConfig.ts         # Phaser 游戏配置
│   │   ├── GameConstants.ts      # 游戏常量 (升级公式等)
│   │   └── FishDatabase.ts       # 鱼类数据表
│   ├── scenes/
│   │   ├── BootScene.ts          # 资源预加载 + 进度条
│   │   ├── MainMenuScene.ts      # 主菜单界面
│   │   ├── GameScene.ts          # 核心游戏场景
│   │   ├── ShopScene.ts          # 升级商店
│   │   ├── HooksScene.ts         # 钩子皮肤选择
│   │   └── CollectionScene.ts    # 鱼类收集图鉴
│   ├── gameobjects/
│   │   ├── Fisherman.ts          # 渔夫角色
│   │   ├── Hook.ts               # 钩子 (含物理碰撞)
│   │   ├── FishingLine.ts        # 钓线渲染
│   │   ├── Fish.ts               # 鱼类基类
│   │   ├── FishFactory.ts        # 鱼类工厂
│   │   └── FishPool.ts           # 鱼对象池 (性能优化)
│   ├── systems/
│   │   ├── UpgradeSystem.ts      # 升级公式逻辑
│   │   ├── SaveManager.ts        # 存档系统 (LocalForage)
│   │   ├── AudioManager.ts       # 音频管理器
│   │   └── OfflineEarnings.ts    # 离线收益计算
│   ├── ui/
│   │   ├── CoinDisplay.ts        # 金币显示组件
│   │   ├── DepthMeter.ts         # 深度计组件
│   │   ├── ProgressBar.ts        # 进度条组件
│   │   └── Button.ts             # 通用按钮组件
│   └── utils/
│       ├── MathUtils.ts          # 数学工具函数
│       └── ResponsiveUtils.ts    # 响应式适配工具
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 四、核心代码框架

### 4.1 Vite 配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      plugins: [
        // 优化 Phaser 包大小
        replace({
          'typeof CANVAS_RENDERER': "'true'",
          'typeof WEBGL_RENDERER': "'true'",
          'typeof EXPERIMENTAL': "'false'",
          'typeof PLUGIN_CAMERA3D': "'false'",
          'typeof PLUGIN_FBINSTANT': "'false'",
          preventAssignment: true
        })
      ],
      output: {
        manualChunks: {
          phaser: ['phaser']  // 单独分块便于缓存
        }
      }
    },
    chunkSizeWarningLimit: 1500
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Tiny Fishing',
        short_name: 'TinyFish',
        description: '休闲钓鱼小游戏',
        theme_color: '#1e88e5',
        background_color: '#87CEEB',
        display: 'fullscreen',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,webp,json,ogg,mp3}']
      }
    })
  ]
});
```

### 4.2 游戏配置 (GameConfig.ts)

```typescript
import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { GameScene } from '../scenes/GameScene';
import { ShopScene } from '../scenes/ShopScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 720,
  height: 1280,
  backgroundColor: '#87CEEB',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 360, height: 640 },
    max: { width: 1440, height: 2560 }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: import.meta.env.DEV
    }
  },
  input: {
    activePointers: 3  // 多点触控支持
  },
  render: {
    antialias: false,
    pixelArt: false,
    powerPreference: 'high-performance'
  },
  fps: {
    target: 60,
    forceSetTimeOut: false
  },
  scene: [BootScene, MainMenuScene, GameScene, ShopScene]
};
```

### 4.3 游戏常量 - 复刻原始公式 (GameConstants.ts)

```typescript
/**
 * 升级系统配置 - 完全复刻原始游戏公式
 */
export const UPGRADE_CONFIG = {
  maxFishes: {
    name: 'MAX FISHES',
    baseValue: 3,
    getValue: (level: number): number => 3 + level,
    getCost: (level: number): number => Math.floor(50 * Math.pow(1.5, level) / 5) * 5
  },
  maxDepth: {
    name: 'MAX DEPTH',
    baseValue: 3,
    getValue: (level: number): number => 3 + level,
    getCost: (level: number): number => Math.floor(50 * Math.pow(1.5, level) / 5) * 5
  },
  earnings: {
    name: 'EARNINGS',
    baseValue: 5,
    getValue: (level: number): number => 5 * Math.pow(1.5, level),
    getCost: (level: number): number => Math.floor(50 * Math.pow(1.5, level) / 5) * 5
  }
};

/**
 * 游戏物理常量
 */
export const PHYSICS = {
  HOOK_SINK_SPEED: 200,      // 钩子下沉速度
  HOOK_RISE_SPEED: 300,      // 钩子上升速度
  HOOK_MOVE_SPEED: 150,      // 钩子左右移动速度
  DEPTH_UNIT_PIXELS: 100,    // 每深度单位的像素数
  WATER_SURFACE_Y: 300       // 水面Y坐标
};

/**
 * 鱼类稀有度
 */
export enum FishRarity {
  COMMON = 'common',
  RARE = 'rare',
  LEGENDARY = 'legendary'
}

/**
 * 鱼类稀有度颜色
 */
export const RARITY_COLORS = {
  [FishRarity.COMMON]: 0xFFFFFF,
  [FishRarity.RARE]: 0x9C27B0,
  [FishRarity.LEGENDARY]: 0xFFD700
};
```

### 4.4 鱼类数据库 (FishDatabase.ts)

```typescript
import { FishRarity } from './GameConstants';

export interface FishData {
  id: number;
  name: string;
  sprite: string;
  price: number;
  minDepth: number;
  maxDepth: number;
  rarity: FishRarity;
  scale: number;
  speed: number;
}

/**
 * 鱼类数据表 - 根据原始游戏逆向分析
 */
export const FISH_DATABASE: FishData[] = [
  // 普通鱼 (浅水区)
  { id: 1, name: 'Goldfish', sprite: 'fish1', price: 10, minDepth: 0, maxDepth: 4, rarity: FishRarity.COMMON, scale: 0.9, speed: 80 },
  { id: 2, name: 'Sardine', sprite: 'fish2', price: 10, minDepth: 0, maxDepth: 4, rarity: FishRarity.COMMON, scale: 0.55, speed: 100 },
  { id: 3, name: 'Clownfish', sprite: 'fish3', price: 15, minDepth: 1, maxDepth: 5, rarity: FishRarity.COMMON, scale: 0.6, speed: 90 },
  { id: 4, name: 'Carp', sprite: 'fish4', price: 20, minDepth: 1, maxDepth: 7, rarity: FishRarity.COMMON, scale: 0.7, speed: 70 },
  
  // 中等鱼 (中层水域)
  { id: 5, name: 'Tuna', sprite: 'fish5', price: 50, minDepth: 5, maxDepth: 12, rarity: FishRarity.COMMON, scale: 0.8, speed: 120 },
  { id: 6, name: 'Salmon', sprite: 'fish6', price: 60, minDepth: 6, maxDepth: 14, rarity: FishRarity.COMMON, scale: 0.75, speed: 110 },
  { id: 7, name: 'Swordfish', sprite: 'fish7', price: 80, minDepth: 8, maxDepth: 16, rarity: FishRarity.COMMON, scale: 0.85, speed: 130 },
  
  // 稀有鱼
  { id: 8, name: 'Golden Carp', sprite: 'fish1g', price: 100, minDepth: 1, maxDepth: 5, rarity: FishRarity.RARE, scale: 0.9, speed: 80 },
  { id: 9, name: 'Manta Ray', sprite: 'fish13', price: 200, minDepth: 10, maxDepth: 18, rarity: FishRarity.RARE, scale: 1.0, speed: 60 },
  { id: 10, name: 'Shark', sprite: 'fish6r', price: 500, minDepth: 12, maxDepth: 20, rarity: FishRarity.RARE, scale: 1.2, speed: 150 },
  
  // 传说级鱼
  { id: 11, name: 'Golden Shark', sprite: 'fish6g', price: 2000, minDepth: 18, maxDepth: 25, rarity: FishRarity.LEGENDARY, scale: 1.3, speed: 160 },
  { id: 12, name: 'Ancient Fish', sprite: 'fish14', price: 5000, minDepth: 20, maxDepth: 27, rarity: FishRarity.LEGENDARY, scale: 1.1, speed: 50 },
  { id: 13, name: 'Legendary Whale', sprite: 'fish29', price: 7000, minDepth: 22, maxDepth: 27, rarity: FishRarity.LEGENDARY, scale: 1.5, speed: 40 },
];

/**
 * 根据深度获取可生成的鱼类
 */
export function getFishByDepth(depth: number): FishData[] {
  return FISH_DATABASE.filter(fish => depth >= fish.minDepth && depth <= fish.maxDepth);
}

/**
 * 根据稀有度权重随机选择鱼类
 */
export function getRandomFish(availableFish: FishData[]): FishData {
  const weights = availableFish.map(fish => {
    switch (fish.rarity) {
      case FishRarity.LEGENDARY: return 0.03;
      case FishRarity.RARE: return 0.1;
      default: return 0.87 / availableFish.filter(f => f.rarity === FishRarity.COMMON).length;
    }
  });
  
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < availableFish.length; i++) {
    random -= weights[i];
    if (random <= 0) return availableFish[i];
  }
  
  return availableFish[0];
}
```

### 4.5 存档管理器 (SaveManager.ts)

```typescript
import localforage from 'localforage';

export interface GameSave {
  // 升级等级
  fishesLevel: number;
  depthLevel: number;
  earningsLevel: number;
  
  // 货币
  coins: number;
  
  // 解锁内容
  unlockedHooks: number[];
  currentHook: number;
  
  // 收集
  caughtFishIds: number[];
  
  // 记录
  bestScore: number;
  maxDepthReached: number;
  totalFishCaught: number;
  
  // 设置
  musicVolume: number;
  sfxVolume: number;
  language: string;
  
  // 离线收益
  lastPlayedTimestamp: number;
}

const DEFAULT_SAVE: GameSave = {
  fishesLevel: 0,
  depthLevel: 0,
  earningsLevel: 0,
  coins: 0,
  unlockedHooks: [1],
  currentHook: 1,
  caughtFishIds: [],
  bestScore: 0,
  maxDepthReached: 0,
  totalFishCaught: 0,
  musicVolume: 0.5,
  sfxVolume: 1.0,
  language: 'en',
  lastPlayedTimestamp: Date.now()
};

class SaveManager {
  private static instance: SaveManager;
  private readonly SAVE_KEY = 'tiny-fishing-save';
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
      const saved = await localforage.getItem<GameSave>(this.SAVE_KEY);
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
      await localforage.setItem(this.SAVE_KEY, this.currentSave);
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
  
  /**
   * 计算离线收益
   */
  calculateOfflineEarnings(): number {
    const now = Date.now();
    const lastPlayed = this.currentSave.lastPlayedTimestamp;
    const minutesOffline = Math.floor((now - lastPlayed) / 60000);
    
    // 最多计算24小时的离线收益
    const cappedMinutes = Math.min(minutesOffline, 24 * 60);
    const earningsPerMinute = 5 * Math.pow(1.5, this.currentSave.earningsLevel);
    
    return Math.floor(cappedMinutes * earningsPerMinute);
  }
  
  async reset(): Promise<void> {
    this.currentSave = { ...DEFAULT_SAVE };
    await this.save();
  }
}

export const saveManager = SaveManager.getInstance();
```

---

## 五、实施任务清单

### 第一阶段：项目搭建 (预计 1-2 天)

| # | 任务 | 优先级 | 预计时间 |
|---|------|--------|----------|
| 1.1 | 初始化 Vite + TypeScript + Phaser 3 项目 | 🔴高 | 1h |
| 1.2 | 配置 vite.config.ts (Phaser优化 + PWA) | 🔴高 | 1h |
| 1.3 | 搭建场景框架 (Boot/Menu/Game/Shop) | 🔴高 | 2h |
| 1.4 | 配置 ESLint + Prettier | 🟡中 | 0.5h |
| 1.5 | 创建项目目录结构 | 🔴高 | 0.5h |

### 第二阶段：核心游戏机制 (预计 3-4 天)

| # | 任务 | 优先级 | 预计时间 |
|---|------|--------|----------|
| 2.1 | 实现钩子物理控制 (下沉/上升/左右移动) | 🔴高 | 3h |
| 2.2 | 实现触摸/鼠标统一输入控制 | 🔴高 | 2h |
| 2.3 | 实现水面和水下背景渲染 | 🔴高 | 2h |
| 2.4 | 实现鱼类生成器 (按深度范围生成) | 🔴高 | 3h |
| 2.5 | 实现鱼类AI移动 (简单巡逻模式) | 🔴高 | 2h |
| 2.6 | 实现碰撞检测和捕获逻辑 | 🔴高 | 3h |
| 2.7 | 实现鱼类对象池优化 | 🟡中 | 2h |
| 2.8 | 实现钓线渲染 (贝塞尔曲线) | 🟡中 | 2h |
| 2.9 | 实现渔夫角色和动画 | 🟡中 | 2h |

### 第三阶段：经济系统 (预计 2 天)

| # | 任务 | 优先级 | 预计时间 |
|---|------|--------|----------|
| 3.1 | 实现升级系统 (复刻原始公式) | 🔴高 | 3h |
| 3.2 | 实现金币系统 (赚取/消费) | 🔴高 | 2h |
| 3.3 | 实现钩子皮肤系统 | 🟡中 | 2h |
| 3.4 | 实现钩子解锁逻辑 | 🟡中 | 1h |
| 3.5 | 实现离线收益计算 | 🟡中 | 2h |

### 第四阶段：存档与UI (预计 2 天)

| # | 任务 | 优先级 | 预计时间 |
|---|------|--------|----------|
| 4.1 | 实现 LocalForage 存档系统 | 🔴高 | 2h |
| 4.2 | 实现主菜单UI | 🔴高 | 3h |
| 4.3 | 实现升级商店UI | 🔴高 | 3h |
| 4.4 | 实现游戏内HUD (金币/深度/鱼数) | 🔴高 | 2h |
| 4.5 | 实现结算界面 | 🔴高 | 2h |
| 4.6 | 实现鱼类收集图鉴 | 🟡中 | 3h |
| 4.7 | 实现设置界面 (音量/语言) | 🟢低 | 2h |

### 第五阶段：美术与音效 (预计 2-3 天)

| # | 任务 | 优先级 | 预计时间 |
|---|------|--------|----------|
| 5.1 | 制作/获取纹理图集资源 | 🔴高 | 4h |
| 5.2 | 制作精灵表配置文件 (JSON) | 🔴高 | 1h |
| 5.3 | 实现渔夫动画 | 🟡中 | 2h |
| 5.4 | 实现水面波动效果 | 🟡中 | 2h |
| 5.5 | 实现捕鱼特效 (粒子) | 🟡中 | 2h |
| 5.6 | 实现金币飞散动画 | 🟡中 | 1h |
| 5.7 | 集成音效 | 🟡中 | 2h |
| 5.8 | 集成背景音乐 | 🟡中 | 1h |

### 第六阶段：优化与发布 (预计 1-2 天)

| # | 任务 | 优先级 | 预计时间 |
|---|------|--------|----------|
| 6.1 | 移动端适配测试 | 🔴高 | 2h |
| 6.2 | 性能优化 (对象池/纹理压缩) | 🟡中 | 2h |
| 6.3 | PWA 完整配置测试 | 🟡中 | 1h |
| 6.4 | 构建生产版本 | 🔴高 | 0.5h |
| 6.5 | 部署到 Vercel/Netlify | 🔴高 | 1h |
| 6.6 | 最终测试和bug修复 | 🔴高 | 2h |

---

## 六、时间预估汇总

| 阶段 | 任务数 | 预计天数 |
|------|--------|----------|
| 第一阶段：项目搭建 | 5 | 1-2 天 |
| 第二阶段：核心机制 | 9 | 3-4 天 |
| 第三阶段：经济系统 | 5 | 2 天 |
| 第四阶段：存档与UI | 7 | 2 天 |
| 第五阶段：美术音效 | 8 | 2-3 天 |
| 第六阶段：优化发布 | 6 | 1-2 天 |
| **总计** | **40** | **11-15 天** |

---

## 七、待确认事项

### 美术资源策略
- [ ] A) 复用原始纹理 (需自行承担版权风险)
- [ ] B) 完全原创重绘
- [ ] C) 使用开源/付费素材替代

### 数值平衡
- [ ] A) 完全复刻原始公式
- [ ] B) 根据测试反馈调整优化

### 额外功能需求
- [ ] 多语言支持 (i18n)
- [ ] 排行榜系统
- [ ] 广告/内购接入
- [ ] 成就系统
- [ ] 社交分享

### 部署目标
- [ ] A) 静态网站 (Vercel/Netlify/GitHub Pages)
- [ ] B) 微信小游戏
- [ ] C) 原生App (Capacitor)
- [ ] D) 多平台同时支持

---

## 八、参考资源

### 官方文档
- [Phaser 3 官方文档](https://phaser.io/docs)
- [Phaser 3 示例库](https://phaser.io/examples)
- [Vite 官方文档](https://vitejs.dev/)
- [LocalForage 文档](https://localforage.github.io/localForage/)

### 推荐学习资源
- [Phaser 3 TypeScript 教程](https://github.com/phaserjs/phaser)
- [HTML5 游戏开发最佳实践](https://developer.mozilla.org/en-US/docs/Games)

### 工具推荐
- **精灵表生成**: [TexturePacker](https://www.codeandweb.com/texturepacker) / [Free Texture Packer](http://free-tex-packer.com/)
- **音效资源**: [Freesound](https://freesound.org/) / [OpenGameArt](https://opengameart.org/)
- **图标生成**: [PWA Asset Generator](https://github.com/nicholasadamou/pwa-asset-generator)

---

*文档生成完毕，祝开发顺利！🎮*
