import { Component, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {

  @ViewChild(IonContent) content: IonContent
  constructor(
    public modalCtrl: ModalController
  ) {}
}
