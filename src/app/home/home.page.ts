import { SettingsPage } from './../settings/settings.page';
import { Component, NgZone, ViewChild } from '@angular/core';
import { ModalController, IonContent, IonRouterOutlet } from '@ionic/angular';
import { HelpPage } from '../help/help.page';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Utils } from '../../service/utils';
declare let usbSerialPort: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  title: string = '串口设备'
  data: any
  receiveDataArray: any[] = []
  receiveData: string = ''
  receiveLength: number = 0
  sendLength: number = 0
  pack: any = ''
  packPlaceholder: string = "输入字符串"
  timer: any = null
  isWriterHex: boolean = false
  isAutoSend: boolean = false
  openStatus: boolean = false
  ms: number = 0
  msTimer: any
  reSendTime: number = null
  autoSendTimer: any
  @ViewChild(IonContent) content: IonContent
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private nativeStorage: NativeStorage,
    private zone: NgZone,
    private utils: Utils
  ) {}

  /**
   * open serial
   *
   * @memberof HomePage
   */
  async openSerialPort() {
    let config = await this.nativeStorage.getItem('config')
    // First request permission
    usbSerialPort.requestPermission(() => {
      console.log('get permission success.');
      usbSerialPort.getDevice(data => {
        this.title = data.name
      })
      // open serial
      usbSerialPort.open(config, () => {
        console.log('Serial connection opened');
        // get open status
        this.isOpen()
        // read listener
        usbSerialPort.readListener(data => {
          clearTimeout(this.timer)
          let view = new Uint8Array(data);
          console.log(this.utils.bytes2HexString(view));
          this.receiveDataArray.push(view)
          this.timer = setTimeout(() => {
            this.zone.run(() => {
              let date = `${this.utils.formatDate(new Date(), 'hh:mm:ss')}.${this.ms}`
              let result_uint8Array = this.utils.concatUint(Uint8Array, ...this.receiveDataArray)
              this.receiveData += `${date} -> ${this.utils.strDivision(this.utils.bytes2HexString(result_uint8Array), 2)}`
              this.receiveData += `<div style="margin-top:8px"></div>`
              this.receiveLength = this.utils.bytes2HexString(result_uint8Array).length / 2
              clearInterval(this.msTimer)
              this.ms = 0
              this.scrollToBottom()
            })
          }, 500)
        }, err => {
          console.log(`Read listener error: ${err}`)
        })
      })
    }, err => {
      console.log(`Get permission error: ${err}`);
      if(this.openStatus) {
        this.zone.run(() => {
          this.openStatus = false
        })
      }
    })
  }

  /**
   * Writer serial
   *
   * @param {string} pack
   * @memberof HomePage
   */
  writerSerial() {
    this.receiveDataArray = []
    this.msTimer = setInterval(() => {
      this.ms += 1
    },1)
    if (this.isWriterHex) {
      usbSerialPort.writeHex(this.pack, (res: any) => {
        console.log('writer res: ', res)
        let date = `${this.utils.formatDate(new Date(), 'hh:mm:ss')}.${this.ms}`
        this.receiveData += `<div>${date} <- ${this.utils.strDivision(this.pack, 2)}</div>`
      })
    } else {
      usbSerialPort.write(this.pack, (res: any) => {
        console.log('writer res: ', res)
        let date = `${this.utils.formatDate(new Date(), 'hh:mm:ss')}.${this.ms}`
        this.receiveData += `<div>${date} <- ${this.utils.strDivision(this.utils.bufToHex(this.utils.stringToBytes(this.pack)), 2)}</div>`
      })
    }
  }

  /**
   * Get open status
   *
   * @memberof HomePage
   */
  isOpen() {
    usbSerialPort.isOpen(status => {
      console.log(`Serial open status: ${status}`);
      this.zone.run(() => {
        this.openStatus = status
      })
    })
  }

  /**
   * Use hex checkbox change
   *
   * @memberof HomePage
   */
  hexChange(){
    if(this.isWriterHex) {
      this.packPlaceholder = '输入Hex字符串'
    }else {
      this.packPlaceholder = '输入字符串'
    }
  }

  /**
   * Auto send checkbox change
   *
   * @memberof HomePage
   */
  autoSendChange(){
    if(this.isAutoSend) {
      this.autoSendTimer = setInterval(() => {
        this.writerSerial()
      }, this.reSendTime ? this.reSendTime : 1000)
    }else {
      clearInterval(this.autoSendTimer)
    }
  }

  /**
   * Close serial
   *
   * @memberof HomePage
   */
  closeSerial() {
    usbSerialPort.close(() => {
      this.isOpen()
    })
  }

  /**
   * Clear receive data
   *
   * @memberof HomePage
   */
  clearData() {
    this.receiveData = ''
  }

  /**
   * Scroll to top
   *
   * @memberof HomePage
   */
  scrollToTop() {
    this.content.scrollToTop(200)
  }

  /**
   * Scroll to bottom
   *
   * @memberof HomePage
   */
  scrollToBottom() {
    this.content.scrollToBottom(500)
  }

  /**
   * Open setting page
   *
   * @returns
   * @memberof HomePage
   */
  async openSetting() {
    let modal = await this.modalCtrl.create({
      component: SettingsPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    })
    return await modal.present()
  }

  /**
   * Open help page
   *
   * @returns
   * @memberof HomePage
   */
  async openHelp() {
    let modal = await this.modalCtrl.create({
      component: HelpPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    })
    return await modal.present()
  }
}
