import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
    selector: 'page-add-market',
    templateUrl: 'addmarket.html'
})
export class AddMarketPage {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('loading') loadingElement: ElementRef;

    position: any;
    map: any;
    autocompleteService: any;
    placesService: any;
    places: any = [];
    query: string = '';
    searchDisabled: boolean = true;
    name: string = ''
    description: string = ''
    date: string = ''

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public geolocation: Geolocation,
        public http: Http,
        public loading: LoadingController
    ) {

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
                this.loadingElement.nativeElement.style.display = 'none';
                var latLng = new google.maps.LatLng(this.position.coords.latitude, this.position.coords.longitude);
                this.map.setCenter(latLng);
                this.map.setZoom(15);
            }

        }).catch((error) => {
            console.log(error);
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

        let postParams = {
            name: this.name,
            description: this.description,
            startdate: this.date,
            lat: this.map.center.lat(),
            lon: this.map.center.lng(),
        }

        loader.present().then(() => {
            this.http.post(
                'http://mimercadillo.com/market/create?token=1234567890',
                postParams,
                options
            )
                .subscribe(res => {
                    loader.dismiss();
                }, (err) => {
                    console.log(err);
                    loader.dismiss();
                });
        });
    }

}
