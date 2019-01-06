import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';
import { MarketPage } from '../market/market';

/**
 * Generated class for the ViewUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-user',
  templateUrl: 'view-user.html',
})
export class ViewUserPage {

  private user : User;
  private markets = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apiProvider: ApiServiceProvider,
    ) {
      this.user = new User();
      let userId = navParams.get('userId');
      this.loadUser(userId);
      this.loadMarkets(userId);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewUserPage');
  }

  public closeModal() {
    this.navCtrl.pop();
  }

  private loadUser(userId : number) {
    this.apiProvider.getPublicUser(userId)
        .subscribe(res => {
            let data = res.json().result;
            this.user.$id = data.id;
            this.user.$email = data.email;
            this.user.$fullname = data.fullname;
            this.user.$photo = data.photo;
            this.user.$description = data.description;

            console.log(this.user)

        }, (err) => {
            console.log(err)
        });
}

view(marketId) {
  console.log(marketId)
  this.navCtrl.push(MarketPage, { marketId: marketId });
}

loadMarkets(userId : number) {
  console.log('Trying to load user markets')

  this.apiProvider.getUserMarkets(userId)
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
        
      }

    }, (err) => {

    });
  }

}
