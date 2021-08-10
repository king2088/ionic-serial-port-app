import { SettingsPage } from './../settings/settings.page';
import { Component, NgZone, ViewChild } from '@angular/core';
import { ModalController, IonContent, IonRouterOutlet, AlertController } from '@ionic/angular';
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
  reSendTime: number = null
  autoSendTimer: any
  @ViewChild(IonContent) content: IonContent
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private nativeStorage: NativeStorage,
    private zone: NgZone,
    private utils: Utils,
    private alertController: AlertController
  ) { }

  ionViewDidEnter() {
    this.initTextareaStyle()
  }
  /**
   * When the app is opened for the first time, the height of ion textarea is 0
   * So change the textarea element height
   *
   * @memberof HomePage
   */
  initTextareaStyle() {
    let textareaWarp: HTMLElement = document.querySelector('.textarea-wrapper')
    if (textareaWarp.clientHeight < 44) {
      setTimeout(() => {
        textareaWarp.style.height = '44px'
        let textarea: HTMLElement = document.querySelector('textarea')
        textarea.style.height = '44px'
      }, 100);
    }
  }

  // switch
  toggleChange() {
    if (this.openStatus) {
      this.openSerialPort()
    } else {
      this.closeSerial()
    }
  }

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
            let now = new Date()
            let dateMs = now.getMilliseconds()
            this.zone.run(() => {
              let date = `<span style="color: #2fdf75">${this.utils.formatDate(now, 'hh:mm:ss')}.${dateMs} > </span>`
              let result_uint8Array = this.utils.concatUint(Uint8Array, ...this.receiveDataArray)
              if (!this.utils.bytes2HexString(result_uint8Array)) {
                return
              }
              this.receiveData += `${date}${this.utils.strDivision(this.utils.bytes2HexString(result_uint8Array), 2)}`
              this.receiveData += `<div style="margin-top:8px"></div>`
              this.receiveLength = this.utils.bytes2HexString(result_uint8Array).length / 2
              this.scrollToBottom()
            })
          }, 500)
        }, err => {
          console.log(`Read listener error: ${err}`)
        })
      })
    }, err => {
      console.log(`Get permission error: ${err}`);
      if (this.openStatus) {
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
    if (!this.openStatus) {
      if (this.pack) {
        this.presentAlert()
      }
      return
    }
    this.receiveDataArray = []
    let now = new Date()
    let dateMs = now.getMilliseconds()
    if (this.isWriterHex) {
      usbSerialPort.writeHex(this.pack, (res: any) => {
        console.log('writer res: ', res)
        let date = `<span style="color:#3880ff">${this.utils.formatDate(now, 'hh:mm:ss')}.${dateMs} < </span>`
        this.receiveData += `<div>${date}${this.utils.strDivision(this.pack, 2)}</div>`
        this.sendLength = this.pack.length / 2
      })
    } else {
      usbSerialPort.write(this.pack, (res: any) => {
        console.log('writer res: ', res)
        let date = `<span style="color:#3880ff">${this.utils.formatDate(now, 'hh:mm:ss')}.${dateMs} < </span>`
        this.receiveData += `<div>${date}${this.utils.strDivision(this.utils.bufToHex(this.utils.stringToBytes(this.pack)), 2)}</div>`
        this.sendLength = this.utils.getStringByteLength(this.pack)
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
   * Format Hex string
   *
   * @memberof HomePage
   */
  formatHexString() {
    if (this.isWriterHex) {
      this.pack = this.pack.replace(/\ /g, '')
      this.pack = this.pack.replace(/\n|\r/g, '')
    }
  }

  /**
   * Use hex checkbox change
   *
   * @memberof HomePage
   */
  hexChange() {
    if (this.isWriterHex) {
      this.packPlaceholder = '输入Hex字符串'
      if (this.pack) {
        this.formatHexString()
      }
    } else {
      this.packPlaceholder = '输入字符串'
    }
  }

  /**
   * Auto send checkbox change
   *
   * @memberof HomePage
   */
  autoSendChange() {
    if (!this.openStatus) return
    if (this.isAutoSend) {
      this.autoSendTimer = setInterval(() => {
        this.writerSerial()
      }, this.reSendTime ? this.reSendTime : 1000)
    } else {
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
    this.receiveDataArray = []
    this.sendLength = 0
    this.receiveLength = 0
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

  // alert
  async presentAlert() {
    const alert = await this.alertController.create({
      header: '提示',
      message: '请先打开串口后再发送，可点击下面的“打开串口”或右上角的开关来打开串口',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancel');
          }
        }, {
          text: '打开串口',
          role: 'open',
          handler: () => {
            console.log('Open serial');
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (role == 'open') {
      this.openSerialPort()
    }
  }
}
