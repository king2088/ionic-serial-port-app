import { TranslateService } from '@ngx-translate/core';
import { SettingsPage } from './../settings/settings.page';
import { Component, NgZone, ViewChild } from '@angular/core';
import { ModalController, IonContent, IonRouterOutlet, AlertController, ToastController } from '@ionic/angular';
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

    title: string;
    data: any;
    receiveDataArray: any[] = [];
    receiveData = '';
    receiveLength = 0;
    sendLength = 0;
    pack: any = '';
    packPlaceholder: string;
    timer: any = null;
    isWriterHex = false;
    isAutoSend = false;
    openStatus = false;
    reSendTime: number = null;
    autoSendTimer: any;
    backgroundClass = '';
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(IonContent) content: IonContent;
    constructor(
        private modalCtrl: ModalController,
        private routerOutlet: IonRouterOutlet,
        private nativeStorage: NativeStorage,
        private zone: NgZone,
        private utils: Utils,
        private alertController: AlertController,
        private toastController: ToastController,
        public translate: TranslateService,
    ) {
        this.title = this.translate.instant('SERIAL_DEVICE_TITLE');
        this.packPlaceholder = this.translate.instant('TEXTAERA_DEFUALT_PLACEHOLDER');
    }

    ionViewDidEnter() {
        this.initTextareaStyle();
        // init background class
        this.nativeStorage.getItem('backgroundClass').then(cssClass => {
            this.backgroundClass = cssClass;
        }, () => {
            this.backgroundClass = '';
        });
        // Switch language listen
        this.translate.onLangChange.subscribe(() => {
            this.title = this.translate.instant('SERIAL_DEVICE_TITLE');
            this.packPlaceholder = this.translate.instant('TEXTAERA_DEFUALT_PLACEHOLDER');
        });
    }
    /**
     * When the app is opened for the first time, the height of ion textarea is 0
     * So change the textarea element height
     *
     * @memberof HomePage
     */
    initTextareaStyle() {
        const textareaWarp: HTMLElement = document.querySelector('.textarea-wrapper');
        if (textareaWarp.clientHeight < 44) {
            setTimeout(() => {
                textareaWarp.style.height = '44px';
                const textarea: HTMLElement = document.querySelector('textarea');
                textarea.style.height = '44px';
            }, 100);
        }
    }

    // switch
    toggleChange() {
        if (this.openStatus) {
            this.openSerialPort();
        } else {
            this.closeSerial();
        }
    }

    /**
     * open serial
     *
     * @memberof HomePage
     */
    async openSerialPort() {
        const config = await this.nativeStorage.getItem('config');
        // First request permission
        usbSerialPort.requestPermission(() => {
            console.log('get permission success.');
            usbSerialPort.getDevice(data => {
                this.title = data.name;
            });
            // open serial
            usbSerialPort.open(config, () => {
                console.log('Serial connection opened');
                // get open status
                this.isOpen();
                // read listener
                usbSerialPort.readListener(data => {
                    clearTimeout(this.timer);
                    const view = new Uint8Array(data);
                    console.log(this.utils.bytes2HexString(view));
                    this.receiveDataArray.push(view);
                    this.timer = setTimeout(() => {
                        const now = new Date();
                        const dateMs = now.getMilliseconds();
                        this.zone.run(() => {
                            const date = `<span style="color: #2fdf75">${this.utils.formatDate(now, 'hh:mm:ss')}.${dateMs} > </span>`;
                            const resultUint8Array = this.utils.concatUint(Uint8Array, ...this.receiveDataArray);
                            if (!this.utils.bytes2HexString(resultUint8Array)) {
                                return;
                            }
                            this.receiveData += `
                <div style="
                  -webkit-user-select: auto;
                  -moz-user-select: auto;
                  -ms-user-select: auto;
                  user-select: auto;">
                  ${date}${this.utils.strDivision(this.utils.bytes2HexString(resultUint8Array), 2)}
                </div>
              `;
                            this.receiveData += `<div style="margin-top:8px"></div>`;
                            this.receiveLength = this.utils.bytes2HexString(resultUint8Array).length / 2;
                            this.scrollToBottom();
                        });
                    }, 500);
                }, err => {
                    console.log(`Read listener error: ${err}`);
                });
            });
        }, err => {
            console.log(`Get permission error: ${err}`);
            if (this.openStatus) {
                this.zone.run(() => {
                    this.openStatus = false;
                    this.title = this.translate.instant('SERIAL_DEVICE_TITLE');
                });
            }
            this.presentToast(this.translate.instant('NO_DEVICE_CONNECTED'));
        });
    }

    /**
     *
     *
     * Writer serial
     *
     *
     *
     * @param pack
     * @memberof HomePage
     */
    writerSerial() {
        if (!this.openStatus) {
            if (this.pack) {
                this.presentAlert();
            }
            return;
        }
        this.receiveDataArray = [];
        const now = new Date();
        const dateMs = now.getMilliseconds();
        if (this.isWriterHex) {
            usbSerialPort.writeHex(this.pack, (res: any) => {
                console.log('writer res: ', res);
                const date = `<span style="color:#3880ff">${this.utils.formatDate(now, 'hh:mm:ss')}.${dateMs} < </span>`;
                this.receiveData += `<div>${date}${this.utils.strDivision(this.pack, 2)}</div>`;
                this.sendLength = this.pack.length / 2;
            }, err => {
                console.log('writer hex err: ', err);
                this.presentToast();
                this.closeSerial();
            });
        } else {
            usbSerialPort.write(this.pack, (res: any) => {
                console.log('writer res: ', res);
                const date = `<span style="color:#3880ff">${this.utils.formatDate(now, 'hh:mm:ss')}.${dateMs} < </span>`;
                this.receiveData += `<div>
                        ${date}${this.utils.strDivision(this.utils.bufToHex(this.utils.stringToBytes(this.pack)), 2)}
                    </div>`;
                this.sendLength = this.utils.getStringByteLength(this.pack);
            }, err => {
                console.log('writer string err: ', err);
                this.presentToast();
                this.closeSerial();
            });
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
                this.openStatus = status;
            });
        });
    }

    /**
     * Format Hex string
     *
     * @memberof HomePage
     */
    formatHexString() {
        if (this.isWriterHex) {
            this.zone.run(() => {
                this.pack = this.pack.replace(/\ /g, '');
                this.pack = this.pack.replace(/\n|\r/g, '');
            });
        }
    }

    /**
     * Use hex checkbox change
     *
     * @memberof HomePage
     */
    hexChange() {
        if (this.isWriterHex) {
            this.packPlaceholder = this.translate.instant('TEXTAERA_HEX_PLACEHOLDER');
            if (this.pack) {
                this.formatHexString();
            }
        } else {
            this.packPlaceholder = this.translate.instant('TEXTAERA_DEFUALT_PLACEHOLDER');
        }
    }

    /**
     * Auto send checkbox change
     *
     * @memberof HomePage
     */
    autoSendChange() {
        if (!this.openStatus) { return; };
        if (this.isAutoSend) {
            this.autoSendTimer = setInterval(() => {
                this.writerSerial();
            }, this.reSendTime ? this.reSendTime : 1000);
        } else {
            clearInterval(this.autoSendTimer);
        }
    }

    /**
     * Close serial
     *
     * @memberof HomePage
     */
    closeSerial(isOpenSerial?: boolean) {
        usbSerialPort.close(() => {
            this.isOpen();
            this.receiveDataArray = [];
            if (isOpenSerial) {
                this.openSerialPort();
            }
        });
    }

    /**
     * Clear receive data
     *
     * @memberof HomePage
     */
    clearData() {
        this.receiveData = '';
        this.receiveDataArray = [];
        this.sendLength = 0;
        this.receiveLength = 0;
    }

    /**
     * Scroll to top
     *
     * @memberof HomePage
     */
    scrollToTop() {
        this.content.scrollToTop(200);
    }

    /**
     * Scroll to bottom
     *
     * @memberof HomePage
     */
    scrollToBottom() {
        this.content.scrollToBottom(500);
    }

    /**
     * Open setting page
     *
     * @returns
     * @memberof HomePage
     */
    async openSetting() {
        const modal = await this.modalCtrl.create({
            component: SettingsPage,
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl
        });
        modal.onDidDismiss().then(async (params: any) => {
            const { data } = params;
            console.log('setting dismiss data', data, data && data.configIsChange && this.openStatus);

            if (data && data.configIsChange && this.openStatus) {
                // 关闭串口再重新开启
                this.closeSerial(true);
            }
            // 设置背景颜色
            this.backgroundClass = await this.nativeStorage.getItem('backgroundClass');
        });
        return await modal.present();
    }

    /**
     * Open help page
     *
     * @returns
     * @memberof HomePage
     */
    async openHelp() {
        const modal = await this.modalCtrl.create({
            component: HelpPage,
            swipeToClose: true,
            presentingElement: this.routerOutlet.nativeEl
        });
        return await modal.present();
    }

    // alert
    async presentAlert() {
        const alert = await this.alertController.create({
            header: this.translate.instant('TIPS'),
            message: this.translate.instant('ALERT_MESSAGE'),
            buttons: [
                {
                    text: this.translate.instant('CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Cancel');
                    }
                }, {
                    text: this.translate.instant('OPEN_SERIAL'),
                    role: 'open',
                    handler: () => {
                        console.log('Open serial');
                    }
                }
            ]
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
        if (role === 'open') {
            this.openSerialPort();
        }
    }

    // Toast
    async presentToast(msg?: string) {
        const toast = await this.toastController.create({
            message: msg ? msg : this.translate.instant('USB_DISCONNECTED'),
            duration: 2000,
            color: 'warning',
            cssClass: 'ion-text-center ion-toast-width',
        });
        toast.present();
    }
}
