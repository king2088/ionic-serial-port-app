import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

import { Utils } from '../service/utils';
import { SettingsPage } from './settings/settings.page';
import { FormsModule } from '@angular/forms';
import { HelpPage } from './help/help.page';

export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http);

@NgModule({
    declarations: [AppComponent, SettingsPage, HelpPage],
    entryComponents: [SettingsPage, HelpPage],
    imports: [
        BrowserModule,
        IonicModule.forRoot({ mode: 'ios' }),
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        StatusBar,
        AppVersion,
        NativeStorage,
        BackgroundMode,
        AppMinimize,
        Utils,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
