import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private nativeStorage: NativeStorage,
    private statusBar: StatusBar,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.setSerialPortDefaultConfig()
      this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#428cff')
    })
    
  }

  /**
   * set default serial port config
   *
   * @memberof AppComponent
   */
  setSerialPortDefaultConfig() {
    this.nativeStorage.getItem('config').then(res => {
      console.log('get config', res);
    }, async err => {
      console.log('storage error');
      let config = {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 0,
        dtr: true,
        rts: true,
        sleepOnPause: true
      }
      await this.nativeStorage.setItem('config', config)
    })
  }
}
