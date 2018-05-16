import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the EditmarketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editmarket',
  templateUrl: 'editmarket.html',
})
export class EditmarketPage {

  market: Market;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider: ApiServiceProvider
  ) {
    this.market = new Market();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditmarketPage');
    this.loadMarket();
  }

  private loadMarket(){
    this.apiProvider.getMarket(this.navParams.get("marketId")).subscribe(
      res => {
        let data = res.json();
        console.log(data)
        //SETTERS
        //this.loadPhotos();

    }, (err) => {
        console.log(err)
    }
    );
    
  }

  private loadPhotos() {
    this.apiProvider.getMarketPhotos(this.market.getId())
        .subscribe(res => {
            let data = res.json();
            console.log(data)
            let photos = data.result
            let length = data.count
            if (length > 0) {
                this.market.clearPhotos();
                photos.forEach((photo, index) => {
                    let photoEntity = new Photo();
                    photoEntity.setId(photo.id);
                    photoEntity.setContent(photo.content);
                    this.market.addPhoto(photoEntity, index);
                }, this);
            }

        }, (err) => {
            console.log(err)
        });
}
}
