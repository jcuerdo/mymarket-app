import { EditmarketPage } from './../editmarket/editmarket';
import { ViewMarketPage } from './../view-market/view-market';
import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { AddMarketPage } from './../addmarket/addmarket';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

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
