import { Component } from '@angular/core';
import { NavController, AlertController,ModalController } from 'ionic-angular';
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
  searchDisabled: boolean = true;
  autocompleteService: any;


  constructor(
    public navCtrl: NavController,
    public modCtrl: ModalController,    
    public http: Http,
    public loading: LoadingController,
    public alertCtrl: AlertController,
    public apiProvider: ApiServiceProvider,
    public locationProvider: LocationServiceProvider,
    public alertProvier : AlertProvider,
    public translate : TranslateService
  ) {}

  ionViewDidLoad(){
  console.log("Loading home page")
  window['mapInit'] = () => {
    this.initMapServices();
  }
  let script = document.createElement("script");
  script.id = "googleMaps";
  script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyDlRrMhhZXm-uhLM6XYAa4EWKdqgDSPPQk&callback=mapInit&libraries=places';
  
  document.body.appendChild(script);

  this.loader = this.loading.create({
    content: this.translate.instant('Obtaining current location')
  });
  this.loader.present();
  this.locationProvider.requestLocation(this.loadMarkets.bind(this), this.loadEmpty.bind(this));
  }

  loadEmpty(error){
    this.loader.dismiss();
    this.emptyMarkets = false;
  }

  loadMarkets() {
  this.emptyMarkets = false;
  console.log('Trying to load markets')
  this.markets = []
  this.apiProvider.getMarkets()
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
      } else{
        this.emptyMarkets = true;
      }
      this.loader.dismiss();
    }, (err) => {
      this.loader.dismiss();
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

  initMapServices() {
    if (google || google.maps) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
        this.placesService = new google.maps.places.PlacesService(document.createElement('div'));

        this.searchDisabled = false;
    }
}

  searchPlace() {
    if (this.query.length > 0 && !this.searchDisabled) {

        let config = {
            types: ['geocode'],
            input: this.query
        }

        this.autocompleteService.getPlacePredictions(config, (predictions, status) => {

            if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {

                this.places = [];

                predictions.forEach((prediction) => {
                    this.places.push(prediction);
                });
            }

        });

    } else {
        this.places = [];
    }

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
      this.loadMarkets()
  });
}

loadCurrentPosition(){
  this.loader = this.loading.create({
    content: this.translate.instant("Loading market list"),
  });
  this.loader.present();
  this.locationProvider.requestLocation(this.loadMarkets.bind(this), this.loadEmpty.bind(this));

}

}
