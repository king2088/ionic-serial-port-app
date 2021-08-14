import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

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
        private backgroundMode: BackgroundMode,
        private translate: TranslateService,
        private appMinimize: AppMinimize
    ) {
        this.platform.ready().then(() => {
            this.setSerialPortDefaultConfig();
            this.statusBar.styleLightContent();
            this.statusBar.backgroundColorByHexString('#3880ff');
            this.useBackgroundMode();
        });
        this.initLocale();
        this.backButtonEvent();
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
            const config = {
                baudRate: 9600,
                dataBits: 8,
                stopBits: 1,
                parity: 0,
                dtr: true,
                rts: true,
                sleepOnPause: true
            };
            await this.nativeStorage.setItem('config', config);
        });
    }

    /**
     * Enable background mode
     *
     * @memberof AppComponent
     */
    useBackgroundMode() {
        this.platform.resume.subscribe(() => {
            console.log('------------App Resum------------');
            if (this.backgroundMode.isEnabled()) {
                this.backgroundMode.disable();
            }
        });
        this.platform.pause.subscribe(() => {
            console.log('------------App Pause------------');
            this.backgroundMode.setDefaults({
                silent: true
            });
            this.backgroundMode.enable();
        });
    }

    // init language
    initLocale() {
        const langArray: any = [
            'af', // 荷兰语
            'ar', // 阿拉伯语
            'hy', // 亚美尼亚
            'be', // 白俄罗斯
            'zh', // 中国
            'cs', // 捷克
            'da', // 丹麦
            'en', // 英语
            'fr', // 法语
            'de', // 德国
            'it', // 意大利
            'ja', // 日语
            'ko', // 韩语
            'ru', // 俄罗斯
            'es', // 西班牙
            'sv', // 瑞典
            'th', // 泰国
            'vi', // 越南
        ];
        this.translate.addLangs(langArray);
        // set defualt language
        this.translate.setDefaultLang('en');
        // Get browser or mobile language
        const browserLang = this.translate.getBrowserLang();
        let regString = '';
        for (const item of langArray) {
            regString += item + '|';
        }
        regString = regString.substring(0, regString.length - 1);
        this.translate.use(browserLang.match(RegExp(regString)) ? browserLang : 'en');
    }

    // active hardware back button
    backButtonEvent() {
        this.platform.backButton.subscribe(async () => {
            // console.log('back button');
            this.appMinimize.minimize();
        });
    }
}
