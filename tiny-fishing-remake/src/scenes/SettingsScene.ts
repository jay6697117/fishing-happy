import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { Button } from '@/ui/Button';
import { saveManager } from '@/systems/SaveManager';
import { getAvailableLanguages, getCurrentLanguage, setLanguage, t } from '@/systems/Localization';

export class SettingsScene extends Phaser.Scene {
  private infoText?: Phaser.GameObjects.Text;
  private languageText?: Phaser.GameObjects.Text;

  constructor() {
    super('SettingsScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.add.text(width / 2, 140, t('Settings', 'SETTINGS'), {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.infoText = this.add.text(width / 2, height / 2 - 40, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.languageText = this.add.text(width / 2, height / 2 + 10, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#0f172a'
    }).setOrigin(0.5);

    new Button(this, width / 2 - 140, height / 2 + 80, '<', () => {
      this.shiftLanguage(-1);
    }, { frameName: 'spr_butOrangeSmall', scale: 0.7, fontSize: '18px' });

    new Button(this, width / 2 + 140, height / 2 + 80, '>', () => {
      this.shiftLanguage(1);
    }, { frameName: 'spr_butOrangeSmall', scale: 0.7, fontSize: '18px' });

    new Button(this, width / 2, height / 2 + 140, 'RESET SAVE', () => {
      void saveManager.reset().then(() => this.refreshUI());
    }, { frameName: 'spr_butDark', scale: 0.65, fontSize: '18px' });

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    }, { frameName: 'spr_butDark', scale: 0.65, fontSize: '18px' });

    this.refreshUI();
  }

  private refreshUI(): void {
    const save = saveManager.data;
    this.infoText?.setText(`${t('Language', 'LANGUAGE')}: ${save.language}`);
    this.languageText?.setText(`${t('Music', 'MUSIC')}: ${Math.round(save.musicVolume * 100)}%`);
  }

  private shiftLanguage(direction: number): void {
    const languages = getAvailableLanguages();
    if (languages.length === 0) return;
    const current = getCurrentLanguage();
    const index = Math.max(0, languages.indexOf(current));
    const nextIndex = (index + direction + languages.length) % languages.length;
    const next = languages[nextIndex];
    setLanguage(next);
    void saveManager.save();
    this.refreshUI();
  }
}
