import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MymarketsPage } from './mymarkets';

@NgModule({
  declarations: [
    MymarketsPage,
  ],
  imports: [
    IonicPageModule.forChild(MymarketsPage),
  ],
})
export class MymarketsPageModule {}
