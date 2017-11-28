import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController,AlertController,ActionSheetController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Market} from '../../models/market';
import {Photo} from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { ViewMarketPage } from '../view-market/view-market';
import { TranslateService } from '@ngx-translate/core';


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
    cameratext = "Camera"
    gallerytext = "Gallery"
    selecttext = "Select origin"
    
    market: Market;
    
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        public loading: LoadingController,
        public alertCtrl: AlertController,
        private camera: Camera,
        private apiProvider: ApiServiceProvider,
        public actionSheetCtrl: ActionSheetController,
        public translate: TranslateService,
        
        
    ) {
        this.market = new Market();
        this.translate.get('Camera').subscribe(
            value => {
              this.cameratext = value;
            }
          );
        
          this.translate.get('Gallery').subscribe(
            value => {
              this.gallerytext = value;
            }
          );

          this.translate.get('Select origin').subscribe(
            value => {
              this.selecttext = value;
            }
          );
        
        
    }

    private ionViewDidLoad(): void {

        window['mapInit'] = () => {
            this.initMap();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyDlRrMhhZXm-uhLM6XYAa4EWKdqgDSPPQk&callback=mapInit&libraries=places';

        document.body.appendChild(script);
    }

    initMap() {
        if (google || google.maps) {
            let lat = localStorage.getItem('lat')
            let lon = localStorage.getItem('lon')
            var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lon))

            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            var marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                title: '',
                icon : {
                    url: "assets/img/market.png",
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            marker.bindTo('position', this.map, 'center');

            this.autocompleteService = new google.maps.places.AutocompleteService();
            this.placesService = new google.maps.places.PlacesService(this.map);
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

        this.places = [];

        let location = {
            lat: null,
            lng: null,
            name: place.name
        };

        this.placesService.getDetails({ placeId: place.place_id }, (details) => {

            location.name = details.name;
            location.lat = details.geometry.location.lat();
            location.lng = details.geometry.location.lng();

            this.map.setCenter({ lat: location.lat, lng: location.lng });
        });

    }

    saveMarket(): void {

        let loader = this.loading.create({
            content: '',
        });

        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        loader.present().then(() => {

            this.market.setLat(this.map.center.lat());
            this.market.setLng(this.map.center.lng());

            this.apiProvider.saveMarket(this.market)
                .subscribe(res => {
                    let data = res.json().result;
                    this.market.setId(data.id);

                    this.market.getPhotos().forEach(function(element) {
                        if(element.getContent()){
                            this.apiProvider.saveMarketPhoto(this.market,element)
                                .subscribe(res => {
                                    let imgData = res.json().result;
                                    element.setId(imgData.id);
                                }, (err) => {
                                    this.presentAlert('Error', 'Image upload fail');
                                });                              
                        }

                    },this);
                    this.navCtrl.push(ViewMarketPage, { market: this.market });                    
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

    uploadPhotoAlert(element,index) {
        let actionSheet = this.actionSheetCtrl.create({
          title: this.selecttext,
          buttons: [
            {
              text: this.cameratext,
              handler: () => {
                this.uploadPhoto(element,index);
              }
            },{
              text: this.gallerytext,
              handler: () => {
                this.uploadPhoto(element,index,this.camera.PictureSourceType.PHOTOLIBRARY);
              }
            }
          ]
        });
        actionSheet.present();
      }
    


    uploadPhoto(element,index,source = this.camera.PictureSourceType.CAMERA) : void {

        const options: CameraOptions = {
            sourceType: source,
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            targetWidth : 600
          }

           this.camera.getPicture(options).then((imageData) => {
           let base64ImageUrl = 'data:image/jpeg;base64,' + imageData;
           let photo = new Photo();
           photo.setContent(base64ImageUrl);
           this.market.addPhoto(photo,index);
           element.srcElement.src = base64ImageUrl;
          }, (err) => {
           console.log(err);
          });
    }

}
