import { Component, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: 'help.page.html',
  styleUrls: ['help.page.scss'],
})
export class HelpPage {

  @ViewChild(IonContent) content: IonContent
  constructor(
    public modalCtrl: ModalController
  ) {}
}
