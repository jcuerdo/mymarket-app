import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarketPage } from './market';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MarketPage,
  ],
  imports: [
    IonicPageModule.forChild(MarketPage),
    TranslateModule.forChild()
  ],
})
export class MarketPageModule {}
