import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
import { getAllHooks, getHookById } from '@/config/HookDatabase';
import { saveManager } from '@/systems/SaveManager';

export class HooksScene extends Phaser.Scene {
  private infoText?: Phaser.GameObjects.Text;

  constructor() {
    super('HooksScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.add.text(width / 2, 140, 'HOOKS', {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.infoText = this.add.text(width / 2, 220, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    const hooks = getAllHooks();
    const currentHookId = saveManager.data.hookChosenId;
    const available = getHookById(currentHookId) ?? hooks[0];

    this.add.text(width / 2, height / 2 - 40, `CURRENT: ${available.spriteName}`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    new Button(this, width / 2, height / 2 + 40, 'SELECT FIRST', () => {
      saveManager.update({ hookChosenId: hooks[0]?.id ?? 1, unlockedHookIds: [hooks[0]?.id ?? 1] });
      void saveManager.save();
      this.refreshUI();
    });

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    });

    this.refreshUI();
  }

  private refreshUI(): void {
    const hooks = getAllHooks();
    this.infoText?.setText(`UNLOCKED: ${saveManager.data.unlockedHookIds.length} / ${hooks.length}`);
  }
}
