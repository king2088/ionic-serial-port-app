import { SettingsPage } from './../settings/settings.page';
import { Component, ViewChild } from '@angular/core';
import { ModalController, IonContent, IonRouterOutlet } from '@ionic/angular';
import { HelpPage } from '../help/help.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  data: any
  instructions: any = ''
  textareaRow: number = 1
  @ViewChild(IonContent) content: IonContent
  constructor(
    public modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet
  ) {
    this.data = `
    <div>11:42:03.344 - 3A 01 11 01 02 03 04 FF D5 22 36 EE</div>
      <div>11:42:03.544 ->> A3 01 11 01 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 29 5E EE</div>
      <div>11:42:03.344 - 3A 01 11 01 02 03 04 FF D5 22 36 EE</div>
      <div>11:42:03.544 ->> A3 01 11 01 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
        00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 29 5E EE</div>
      `
      this.instructions = '3A011101020000DCEDEE'
      this.textareaRow = Math.round(this.instructions.length/33)
      console.log('====================================');
      console.log('this.textareaRow', this.textareaRow);
      console.log('====================================');
  }

  addContent() {
    
  }

  clearData() {
    this.data = ''
  }

  scrollToTop() {
    this.content.scrollToTop(200)
  }

  scrollToBottom() {
    this.content.scrollToBottom(500)
  }

  async openSetting() {
    let modal = await this.modalCtrl.create({
      component: SettingsPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    })
    return await modal.present()
  }
  
  async openHelp() {
    let modal = await this.modalCtrl.create({
      component: HelpPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    })
    return await modal.present()
  }
}
