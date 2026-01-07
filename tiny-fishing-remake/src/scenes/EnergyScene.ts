import Phaser from 'phaser';
import { AssetKeys } from '@/config/AssetKeys';
import { ENERGY_CONFIG } from '@/config/GameConstants';
import { applyEnergyRegen, restoreEnergy } from '@/systems/EnergySystem';
import { saveManager } from '@/systems/SaveManager';
import { Button } from '@/ui/Button';
import { t } from '@/systems/Localization';

const POTION_COST_GEMS = 50;

export class EnergyScene extends Phaser.Scene {
  private infoText?: Phaser.GameObjects.Text;
  private hintText?: Phaser.GameObjects.Text;

  constructor() {
    super('EnergyScene');
  }

  create(): void {
    const { width, height } = this.scale;
    applyEnergyRegen();
    void saveManager.save();
    this.add.image(width / 2, height / 2, AssetKeys.images.background).setDisplaySize(width, height);

    this.add.text(width / 2, 140, t('Do_smth_for_energy', 'ENERGY'), {
      fontFamily: 'Trebuchet MS',
      fontSize: '48px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.infoText = this.add.text(width / 2, height / 2 - 40, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#0f172a'
    }).setOrigin(0.5);

    this.hintText = this.add.text(width / 2, height / 2 + 10, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#0f172a'
    }).setOrigin(0.5);

    new Button(this, width / 2, height / 2 + 80, t('Buy', 'BUY'), () => {
      this.tryBuyPotion();
    }, { frameName: 'spr_butOrange', scale: 0.7, fontSize: '20px' });

    new Button(this, width / 2, height - 120, 'BACK', () => {
      this.scene.start('MainMenuScene');
    }, { frameName: 'spr_butDark', scale: 0.65, fontSize: '18px' });

    this.refreshUI();
  }

  private tryBuyPotion(): void {
    const save = saveManager.data;
    if (save.gems < POTION_COST_GEMS) {
      this.flashHint('NOT ENOUGH GEMS');
      return;
    }

    saveManager.update({ gems: save.gems - POTION_COST_GEMS });
    restoreEnergy(ENERGY_CONFIG.maxEnergy);
    void saveManager.save();
    this.refreshUI();
  }

  private refreshUI(): void {
    const save = saveManager.data;
    this.infoText?.setText(`ENERGY: ${save.energy}/${ENERGY_CONFIG.maxEnergy} | GEMS: ${save.gems}`);
    const hint = t('Buy_energy_potion_to_restore', 'BUY ENERGY POTION#TO RESTORE ENERGY').replace(/\n/g, ' ');
    this.hintText?.setText(`${hint} | ${t('Price', 'PRICE')}: ${POTION_COST_GEMS} GEMS`);
  }

  private flashHint(text: string): void {
    if (!this.hintText) return;
    this.hintText.setText(text);
    this.time.delayedCall(1200, () => {
      const hint = t('Buy_energy_potion_to_restore', 'BUY ENERGY POTION#TO RESTORE ENERGY').replace(/\n/g, ' ');
      this.hintText?.setText(`${hint} | ${t('Price', 'PRICE')}: ${POTION_COST_GEMS} GEMS`);
    });
  }
}
