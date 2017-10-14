import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Market} from '../../models/market';
import { Http } from '@angular/http';
import {Photo} from '../../models/photo';

/**
 * Generated class for the ViewMarketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-market',
  templateUrl: 'view-market.html',
})
export class ViewMarketPage {

  market : Market;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
  ) {
    let marketData = navParams.get("market");
    this.market = new Market();
    this.market.setId(marketData.id);
    this.market.setName(marketData.name);
    this.market.setDescription(marketData.description);
    this.market.setDate(marketData.startDate);
    
    let photoEntity = new Photo();
    photoEntity.setContent('../../assets/img/image.png');
    this.market.addPhoto(photoEntity,null);
  }

   ngOnInit(): void {
    this.http.get(
      'http://192.168.1.128/market/' + this.market.getId() + '/photo/?token=1234567890'
  )
      .subscribe(res => {
          let photos = res.json();
          if(photos){
            this.market.clearPhotos();
            photos.forEach((photo,index) => {
              let photoEntity = new Photo();
              photoEntity.setId(photo.id);
              photoEntity.setContent(photo.content);
              this.market.addPhoto(photoEntity, index);
            },this);
          }
          else{

          }
      }, (err) => {

      });  
    }

}
