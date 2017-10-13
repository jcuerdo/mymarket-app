import { Component } from '@angular/core';
import { NavController, AlertController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AddMarketPage } from '../addmarket/addmarket';
import { ViewMarketPage } from '../view-market/view-market';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public lista = [];
  public aviso = "";
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loading: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.lista = [];

    let loader = this.loading.create({
      content: '',
    });

    loader.present().then(() => {
      this.http.get('http://192.168.1.128/market?token=1234567890')
          .subscribe(res => {
            this.lista = res.json();
            this.lista.forEach(element => {
              this.http.get(
                'http://192.168.1.128/market/' + element.id + '/photo/first?token=1234567890'
            )
                .subscribe(res => {
                    let photo = res.json();
                    if(photo){
                      element.image = photo.content;
                    }
                    else{
                      element.image = '../../assets/img/image.png';
                    }
                }, (err) => {
                });  
            },this);
            loader.dismiss();
          }, (err) => {
            console.log(err);
            loader.dismiss();
            this.presentAlert('Error', 'Connection Error');
          });
    });
  }

  presentAlert(title : string, content: string) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Ok']
    });
    alert.present();
  }

  public view (market){
    this.navCtrl.push(ViewMarketPage,{market:market});
  }

  public add (){
    this.navCtrl.push(AddMarketPage);
  }

}
