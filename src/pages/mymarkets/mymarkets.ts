import { EditmarketPage } from './../editmarket/editmarket';
import { ViewMarketPage } from './../view-market/view-market';
import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { AddMarketPage } from './../addmarket/addmarket';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';

/**
 * Generated class for the MymarketsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mymarkets',
  templateUrl: 'mymarkets.html',
})
export class MymarketsPage {
  
  public markets = [];
  public emptyMarkets = false;
  private loader : any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider: ApiServiceProvider,
    public alertProvier: AlertProvider,
    public translate: TranslateService,
    public loading: LoadingController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MymarketsPage');

    this.loader = this.loading.create({
      content: this.translate.instant("Loading market list"),
    });
    this.loader.present();
    this.loadMarkets()
  }

  add() {
    this.navCtrl.push(AddMarketPage);
   }

   repeat(marketId, marketNewDate) {
    this.apiProvider.repeatMarket(marketId, marketNewDate).subscribe(
      result => {
        let repeatedMarket = result.json().result;
        this.view(repeatedMarket.id)
      },
      err => {
        this.loader.present();
        this.alertProvier.presentAlert(this.translate.instant("Error"), err)
      }
  );
   }

  delete(marketId){
    this.loader = this.loading.create({
      content: this.translate.instant("Deleting market"),
    });
    this.loader.present();
    this.apiProvider.removeMarket(marketId).subscribe(
      result => {
        this.loadMarkets()
      },
      err => {
        this.loader.present();
        this.alertProvier.presentAlert(this.translate.instant("Error"), err)
      }
  );
  }

  edit(marketId){
    this.navCtrl.push(EditmarketPage, { marketId: marketId });
  }

  view(marketId) {
    this.navCtrl.push(ViewMarketPage, { marketId: marketId });
  }

   loadMarkets() {
    this.emptyMarkets = false;
    console.log('Trying to load my markets')

    this.apiProvider.getMyMarkets()
      .subscribe(res => {
        console.log('API getMarkets response with ' +  res.json().count + " results.")
        if(res.json().count > 0) {
          let result = res.json().result;
          this.markets = []         
          result.forEach(data => {
            let market = new Market()
            this.markets.push(market)
            market.setName(data.name)
            market.setDescription(data.description)
            market.setDate(new Date(data.startdate).toISOString())
            market.setId(data.id)
            market.setLat(data.lat)
            market.setLng(data.lon)
            market.setType(data.type)
            market.setPlace(data.place)
            market.setFlexible(data.flexible)

            market.addPhoto(new Photo(0, 'assets/img/image.png'), 0);

            this.apiProvider.getMarketFirstPhoto(market.getId())
              .subscribe(res => {
                let photo = res.json().result;
                if (photo) {
                  market.addPhoto(new Photo(0, photo.content), 0);
                }
              }, (err) => {
              });
          }, this);
        }else{
          this.emptyMarkets = true;
        }
        this.loader.dismiss();
      }, (err) => {
        this.loader.dismiss();
        this.alertProvier.presentAlert(this.translate.instant("Error"), err)
      });
    }
}
