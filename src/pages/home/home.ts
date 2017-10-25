import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';
import { Http } from '@angular/http';
import { AddMarketPage } from '../addmarket/addmarket';
import { ViewMarketPage } from '../view-market/view-market';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import {Market} from '../../models/market';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public markets = [];
  public aviso = "";

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loading: LoadingController,
    public alertCtrl: AlertController,
    private apiProvider: ApiServiceProvider,
  ) {
    let loader = this.loading.create({
      content: '',
    });

    loader.present().then(() => {
      this.loadMarkets(loader);
    });
  }

  private loadMarkets(loader: Loading) {
    this.apiProvider.getMarkets()
      .subscribe(res => {
        this.markets = res.json();
        this.markets.forEach(element => {
          element.image = 'assets/img/image.png';
          this.apiProvider.getMarketFirstPhoto(element.id)
            .subscribe(res => {
              let photo = res.json();
              if (photo) {
                element.image = photo.content;
              }
            }, (err) => {
            });
        }, this);
        loader.dismiss();
      }, (err) => {
        loader.dismiss();
        this.presentAlert('Error', 'Connection Error');
      });
  }

  presentAlert(title: string, content: string) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Ok']
    });
    alert.present();
  }

  public view(marketData) {
    let market = new Market();
    market.setId(marketData.id);
    market.setName(marketData.name);
    market.setDescription(marketData.description);
    market.setDate(marketData.startDate);
    market.setLat(marketData.lat);
    market.setLng(marketData.lon);

    this.navCtrl.push(ViewMarketPage, { market: market });
  }

  public add() {
    this.navCtrl.push(AddMarketPage);
  }

}
