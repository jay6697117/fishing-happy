import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
import { getAllHooks, getHookById } from '@/config/HookDatabase';
import { saveManager } from '@/systems/SaveManager';
import { t } from '@/systems/Localization';
import { getFirstFrame } from '@/config/SpriteFrames';

interface HookSlot {
  id: number;
  icon: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
}

export class HooksScene extends Phaser.Scene {
  private infoText?: Phaser.GameObjects.Text;
  private hookSlots: HookSlot[] = [];

  constructor() {
    super('HooksScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.add.text(width / 2, 140, t('Hooks', 'HOOKS'), {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.infoText = this.add.text(width / 2, 220, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const panel = this.add.image(width / 2, height / 2 + 40, AssetKeys.atlases.main, getFirstFrame('spr_inventory'));
    const panelScale = Math.min(width * 0.9 / panel.width, height * 0.55 / panel.height);
    panel.setScale(panelScale);

    this.add.text(width / 2, height / 2 - panel.displayHeight / 2 - 40, `CURRENT: ${getHookById(saveManager.data.hookChosenId)?.spriteName ?? 'spr_hook2'}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.renderHookGrid(panel);

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    }, { frameName: 'spr_butDark', scale: 0.65, fontSize: '18px' });

    this.refreshUI();
  }

  private refreshUI(): void {
    const hooks = getAllHooks();
    this.infoText?.setText(`UNLOCKED: ${saveManager.data.unlockedHookIds.length} / ${hooks.length}`);
    const currentId = saveManager.data.hookChosenId;
    this.hookSlots.forEach((slot) => {
      slot.glow.setVisible(slot.id === currentId);
    });
  }

  private renderHookGrid(panel: Phaser.GameObjects.Image): void {
    const hooks = getAllHooks();
    const panelBounds = panel.getBounds();
    const columns = 3;
    const rows = Math.ceil(hooks.length / columns);
    const cellWidth = panelBounds.width / columns;
    const cellHeight = panelBounds.height / rows;
    const startX = panelBounds.left + cellWidth / 2;
    const startY = panelBounds.top + cellHeight / 2;

    this.hookSlots = hooks.map((hook, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + col * cellWidth;
      const y = startY + row * cellHeight;

      const glow = this.add.image(x, y, AssetKeys.atlases.main, getFirstFrame('spr_hook_glow')).setScale(0.7);
      const icon = this.add.image(x, y, AssetKeys.atlases.main, getFirstFrame(hook.spriteName));
      const targetHeight = cellHeight * 0.55;
      icon.setScale(targetHeight / icon.height);

      const unlocked = saveManager.data.unlockedHookIds.includes(hook.id);
      if (!unlocked) {
        icon.setTint(0x64748b);
      }

      icon.setInteractive({ useHandCursor: unlocked });
      icon.on('pointerdown', () => {
        if (!unlocked) return;
        saveManager.update({ hookChosenId: hook.id });
        void saveManager.save();
        this.refreshUI();
      });

      return { id: hook.id, icon, glow };
    });
  }
}
