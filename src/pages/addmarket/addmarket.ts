import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController,AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Market} from '../../models/market';
import {Photo} from '../../models/photo';

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
        private camera: Camera
    ) {
        this.market = new Market();
    }

    private ionViewDidLoad(): void {

        window['mapInit'] = () => {
            this.initMap();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyDlRrMhhZXm-uhLM6XYAa4EWKdqgDSPPQk&callback=mapInit&libraries=places';

        document.body.appendChild(script);

        this.geolocation.getCurrentPosition().then((position) => {
            this.position = position;
            if (this.map) {
                var latLng = new google.maps.LatLng(this.position.coords.latitude, this.position.coords.longitude);
                this.map.setCenter(latLng);
                this.map.setZoom(15);
            }
        }).catch((error) => {
            this.presentAlert('Error', error.message);            
        });
    }

    initMap() {
        if (google || google.maps) {
            if (this.position) {
                var latLng = new google.maps.LatLng(this.position.coords.latitude, this.position.coords.longitude);
                var zoom = 15;
            } else {
                var latLng = new google.maps.LatLng(40.423504, -3.689432);
                var zoom = 10;
            }

            let mapOptions = {
                center: latLng,
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            var marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                title: ''
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

            let postParams = {
                name: this.market.getName(),
                description: this.market.getDescription(),
                startdate: this.market.getDate(),
                lat: this.market.getLat(),
                lon: this.market.getLng(),
            }

            this.http.post(
                'http://192.168.1.128/market/create?token=1234567890',
                postParams,
                options
            )
                .subscribe(res => {
                    let data = res.json();
                    this.market.setId(data.id);

                    this.market.getPhotos().forEach(function(element) {
                        if(element.getContent()){
                            let postParams = {
                                id: this.market.getId(),
                                content: element.getContent(),
                            }
                            this.http.post(
                                'http://192.168.1.128/market/photo/create?token=1234567890',
                                postParams,
                                options
                            )
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
