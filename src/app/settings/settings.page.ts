import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Component, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  version: any = ''
  config: object = {}
  @ViewChild(IonContent) content: IonContent
  constructor(
    private modalCtrl: ModalController,
    private appVersion: AppVersion,
    private nativeStorage: NativeStorage
  ) {
    this.getVersion()
    this.getSerialportConfig()
  }

  /**
   * get App version
   *
   * @memberof SettingsPage
   */
  async getVersion() {
    this.version = await this.appVersion.getVersionNumber()
  }

  /**
   * Get serial port config
   *
   * @memberof SettingsPage
   */
  async getSerialportConfig() {
    this.config = await this.nativeStorage.getItem('config')
    console.log('config', this.config);
    
  }
}
