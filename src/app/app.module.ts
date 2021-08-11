import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Utils } from '../service/utils';
import { SettingsPage } from './settings/settings.page';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SettingsPage],
  entryComponents: [SettingsPage],
  imports: [BrowserModule, IonicModule.forRoot({mode: 'ios'}), AppRoutingModule, FormsModule],
  providers: [StatusBar, AppVersion, NativeStorage, BackgroundMode, Utils, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
