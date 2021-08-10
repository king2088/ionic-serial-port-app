import { BackgroundMode } from '@ionic-native/background-mode/ngx';
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
    private platform: Platform,
    private backgroundMode: BackgroundMode
  ) {
    this.platform.ready().then(() => {
      this.setSerialPortDefaultConfig()
      this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#3880ff')
      this.useBackgroundMode()
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

  /**
   * Enable background mode
   *
   * @memberof AppComponent
   */
  useBackgroundMode() {
    this.platform.resume.subscribe(() => {
      console.log('------------App Resum------------')
      if(this.backgroundMode.isEnabled()) {
        this.backgroundMode.disable()
      }
    })
    this.platform.pause.subscribe(() => {
      console.log('------------App Pause------------')
      this.backgroundMode.setDefaults({
        silent: true
      })
      this.backgroundMode.enable()
    })
  }

}
