import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController,AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Market} from '../../models/market';
import {Photo} from '../../models/photo';
import {ApiServiceProvider} from '../../providers/api-service/api-service';
import {MapProvider} from '../../providers/map/map';

@Component({
    selector: 'page-add-market',
    templateUrl: 'addmarket.html'
})
export class AddMarketPage {
    
    @ViewChild('map') mapElement: ElementRef;

    position: any;
    map: any;
    autocompleteService: any;
    placesService: any;
    places: any = [];
    query: string = '';
    searchDisabled: boolean = true;
    
    market: Market;
    
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public geolocation: Geolocation,
        public http: Http,
        public loading: LoadingController,
        public alertCtrl: AlertController,
        private camera: Camera,
        private apiProvider: ApiServiceProvider,
        private mapProvider: MapProvider,
        
    ) {
        this.market = new Market();
    }

    private ionViewDidLoad(): void {

        this.mapProvider.createMap(this.mapElement);
        this.mapProvider.getPosition().then(pos => {
            this.mapProvider.changeMapPosition(pos);
        });
    }

    searchPlace() {
        this.mapProvider.searchPlace(this.query, this.places);
    }

    selectPlace(place) {
        this.mapProvider.selectPlace(place);
        this.places = [];
    }

    saveMarket(): void {

        let loader = this.loading.create({
            content: '',
        });

        this.market.setLat(this.mapProvider.getCenter().lat());
        this.market.setLng(this.mapProvider.getCenter().lng());

        loader.present().then(() => {

            this.apiProvider.saveMarket(this.market)
                .subscribe(res => {
                    let data = res.json();
                    this.market.setId(data.id);

                    this.market.getPhotos().forEach(function(element) {
                        if(element.getContent()){
                            this.apiProvider.savePhoto(this.market, element)
                                .subscribe(res => {
                                    let imgData = res.json();
                                    element.setId(imgData.id);
                                    
                                }, (err) => {
                                    this.presentAlert('Error', 'Image upload fail');
                                });                              
                        }

                    },this);
                    loader.dismiss();
                }, (err) => {
                    loader.dismiss();
                    this.presentAlert('Error', err);
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

    uploadPhoto(element,index) : void {

        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
          }
           this.camera.getPicture(options).then((imageData) => {
               this.getPhoto(imageData, index, element);
          }, (err) => {
           console.log(err);
          });
    }


    private getPhoto(imageData: any, index: any, element: any) {
        let base64ImageUrl = 'data:image/jpeg;base64,' + imageData;
        let photo = new Photo();
        photo.setContent(base64ImageUrl);
        this.market.addPhoto(photo, index);
        element.srcElement.src = base64ImageUrl;
    }
}
