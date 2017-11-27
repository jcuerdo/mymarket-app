import { Component } from '@angular/core';
import { NavController, AlertController,ModalController } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';
import { Http } from '@angular/http';
import { AddMarketPage } from '../addmarket/addmarket';
import { ViewMarketPage } from '../view-market/view-market';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import {Market} from '../../models/market';
import {MarketmapPage} from '../marketmap/marketmap';
import { CookieXSRFStrategy } from '@angular/http/src/backends/xhr_backend';
import { ConfigToken } from 'ionic-angular/config/config';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public markets = [];
  public aviso = "";

  constructor(
    public navCtrl: NavController,
    public modCtrl: ModalController,    
    public http: Http,
    public loading: LoadingController,
    public alertCtrl: AlertController,
    private apiProvider: ApiServiceProvider,
    public geolocation: Geolocation,
  ) {
    let loader = this.loading.create({
      content: '',
    });

    loader.present().then(() => {
      loader.setContent("Getting location")
      this.loadLocation(loader)      
    });
  }

  private loadLocation(loader: Loading){
    this.geolocation.getCurrentPosition().then((position) => {
      localStorage.setItem("lat", position.coords.latitude.toString())
      localStorage.setItem("lon", position.coords.longitude.toString())
      this.loadMarkets(loader)
  }).catch((error) => {
      loader.dismiss();
      this.presentAlert('Error, location not available', error.message);            
  });

  let watch = this.geolocation.watchPosition();
    watch.subscribe((position) => {
      if(position.coords){
        localStorage.setItem("lat", position.coords.latitude.toString())
        localStorage.setItem("lon", position.coords.longitude.toString())
      }
  });

}

  private loadMarkets(loader: Loading) {
    loader.setContent("Getting list of markets")
    this.apiProvider.getMarkets()
      .subscribe(res => {
        this.markets = res.json().result;
        this.markets.forEach(element => {
          element.image = 'assets/img/image.png';
          this.apiProvider.getMarketFirstPhoto(element.id)
            .subscribe(res => {
              let photo = res.json().result;
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

  private showMap(){
    let profileModal = this.modCtrl.create(MarketmapPage, { markets: this.markets });
    profileModal.onDidDismiss(data => {
    });
    profileModal.present();
  }
}
