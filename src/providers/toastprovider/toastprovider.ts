import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToastproviderProvider {

  constructor(
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {
  }


  public presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: this.translate.instant(message),
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }

}
