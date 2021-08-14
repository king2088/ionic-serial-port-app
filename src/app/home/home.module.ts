import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core';

import { HomePageRoutingModule } from './home-routing.module';
import { SafeHtmlPipe } from '../pipe/safeHtml.pipe';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        HomePageRoutingModule,
    ],
    declarations: [HomePage, SafeHtmlPipe]
})
export class HomePageModule { }
