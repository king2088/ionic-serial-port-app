import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Component, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  version: any = ''
  config: any = {}
  configTemp: object = {}
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
    private modalController: ModalController,
    private zone: NgZone
  ) { }

  ionViewWillEnter() {
    this.initBackgroundColor()
    this.getVersion()
    this.getSerialPortConfig()
  }

  async initBackgroundColor() {
    let backgroundClass = await this.nativeStorage.getItem('backgroundClass')
    console.log('settings backagroun class', backgroundClass);

    let activeClass = 'color-active'
    this.colorList.forEach((item, index) => {
      if (item == backgroundClass) {
        console.log('have same');
        this.zone.run(() => {
          this.colorList[index] = `${item} ${activeClass}`
        })
      }
    })
    console.log('color list', this.colorList);

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
    this.configTemp = Object.assign({}, this.config)
    console.log('config', this.config);
  }

  async setSerialPortConfig() {
    console.log('save config', JSON.stringify(this.config), JSON.stringify(this.configTemp));
    
    await this.nativeStorage.setItem('config', this.config)
    let configIsCHange = JSON.stringify(this.configTemp) != JSON.stringify(this.config)
    this.modalController.dismiss({ configIsChange: configIsCHange })
  }

  async setBackgroundColor(className: string) {
    await this.nativeStorage.setItem('backgroundClass', className)
    this.modalController.dismiss()
  }

}
