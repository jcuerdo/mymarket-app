import { Component } from '@angular/core';
import { NavController, AlertController,ModalController, ActionSheetController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AddMarketPage } from '../addmarket/addmarket';
import { ViewMarketPage } from '../view-market/view-market';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { MarketmapPage } from '../marketmap/marketmap';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from '../../providers/alert/alert';
import { LoginPage } from '../login/login';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';
import { MapboxProvider } from '../../providers/mapbox/mapbox';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public markets = [];
  public emptyMarkets = false;
  public aviso = "";
  private loader;
  placesService: any;
  places: any = [];
  place: any = null;
  query: string = '';
  autocompleteService: any;
  page = 0;

  constructor(
    public navCtrl: NavController,
    public modCtrl: ModalController,    
    public http: Http,
    public loading: LoadingController,
    public alertCtrl: AlertController,
    public apiProvider: ApiServiceProvider,
    public locationProvider: LocationServiceProvider,
    public alertProvier : AlertProvider,
    public translate : TranslateService,
    private mapboxProvider : MapboxProvider,
    public actionSheetCtrl: ActionSheetController,

  ) {}

  ionViewDidLoad(){
    let map = this.mapboxProvider.createEmptyMap()
    let search = this.mapboxProvider.createSearch(map, 'searchPlaceHome')

    search.on('result', function(result){
      localStorage.setItem("lat", result.result.center[1]);
      localStorage.setItem("lon", result.result.center[0]);
      this.markets = []
      this.page = 0;
      this.loadMarkets()
    }.bind(this));

  console.log("Loading home page")
  this.loader = this.loading.create({
    content: this.translate.instant('Obtaining current location')
  });
  this.loader.present();
  this.locationProvider.requestLocation(this.loadMarkets.bind(this), this.loadEmpty.bind(this));
  }

  loadEmpty(error){
    this.loader.dismiss();
    this.emptyMarkets = true;
  }

  doInfinite(infiniteScroll) {
    this.loadMarkets(infiniteScroll)
  }
  loadMarkets(infiniteScroll = null) {
  this.emptyMarkets = false;
  console.log('Trying to load markets')

  this.apiProvider.getMarkets(this.page)
    .subscribe(res => {
      console.log('API getMarkets response with ' +  res.json().count + " results.")
      if(res.json().count > 0) {
        this.page++;
        let markets = res.json().result;          
        markets.forEach(data => {
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
          market.setGooglePlaceIdPlace(data.google_place_id)

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
      } else{
      if(this.markets.length == 0){
        this.emptyMarkets = true;
      } else{
        this.loader.dismiss();
      }
     }
      this.loader.dismiss();
      if(infiniteScroll){
        infiniteScroll.complete();
      }
    }, (err) => {
      this.loader.dismiss();
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      this.alertProvier.presentAlert(this.translate.instant("Error"), err)
    });
  }

  view(marketId) {
    console.log(marketId)
    this.navCtrl.push(ViewMarketPage, { marketId: marketId });
  }

  add() {
   if(localStorage.getItem('token')){
    this.navCtrl.push(AddMarketPage);
   } else{
     this.navCtrl.push(LoginPage)
   }
  }

  showMap(){
    let profileModal = this.modCtrl.create(MarketmapPage, { markets: this.markets });
    profileModal.onDidDismiss(data => {
    });
    profileModal.present();
  }


selectPlace(place) {
  this.loader = this.loading.create({
    content: this.translate.instant("Loading market list"),
  });
  this.loader.present();
  this.place = place
  this.places = [];

  this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      console.log(details)
      localStorage.setItem("lat", details.geometry.location.lat());
      localStorage.setItem("lon", details.geometry.location.lng());
      this.markets = []
      this.page = 0;
      this.loadMarkets()
  });
}

loadCurrentPosition(){
  this.loader = this.loading.create({
    content: this.translate.instant("Loading market list"),
  });
  this.loader.present();
  this.markets = []
  this.page = 0;

  if (localStorage.getItem('currentlat') != null && localStorage.getItem('currentlon') != null) {
    localStorage.setItem("lat", localStorage.getItem('currentlat'));
    localStorage.setItem("lon", localStorage.getItem('currentlon'));
  }

  this.locationProvider.requestLocation(this.loadMarkets.bind(this), this.loadEmpty.bind(this));
}

positionIsLoaded(){
  var isLoaded = localStorage.getItem('lat') != null && localStorage.getItem('lon') != null;
  return isLoaded
}

openFilter(){
  let actionSheet = this.actionSheetCtrl.create({
    title: this.translate.instant("Filter markets"),
    buttons: [
      {
        text: this.translate.instant("Show only private markets"),
        handler: () => {
          localStorage.setItem('marketPrivacy', 'private')
          this.markets = []
          this.page = 0;
          this.loadMarkets()
        }
      },{
        text: this.translate.instant("Show only public markets"),
        handler: () => {
          localStorage.setItem('marketPrivacy', 'public')
          this.markets = []
          this.page = 0;
          this.loadMarkets()
        }
      },{
        text: this.translate.instant("Show all markets"),
        handler: () => {
          localStorage.setItem('marketPrivacy', '')
          this.markets = []
          this.page = 0;
          this.loadMarkets()
        }
      }
    ]
  });
  actionSheet.present();
}

clearFilters(){
  localStorage.setItem('marketPrivacy', '')
  this.markets = []
  this.page = 0;
  this.loadMarkets()
}
}
