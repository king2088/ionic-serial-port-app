import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  version: any = ''
  config: object = {}
  colorList: any[] = [
    'color-white',
    'color-red',
    'color-blue',
    'color-cyan',
    'color-yellow',
    'color-green',
    'color-black',
    'color-cornsilk',
    'color-darkviolet',
    'color-gainsboro',
    'color-maroon',
    'color-pink',
  ]
  constructor(
    private appVersion: AppVersion,
    private nativeStorage: NativeStorage,
    private modalController: ModalController
  ) {
    this.getVersion()
    this.getSerialPortConfig()
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
  async getSerialPortConfig() {
    this.config = await this.nativeStorage.getItem('config')
    console.log('config', this.config);
  }

  async setSerialPortConfig() {
    await this.nativeStorage.setItem('config', this.config)
    this.modalController.dismiss()
  }

  async setBackgroundColor(className: string) {
    await this.nativeStorage.setItem('backgroundClass', className)
    this.modalController.dismiss()
  }

}
