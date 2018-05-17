import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Market } from '../../models/market';
import { Http } from '@angular/http';
import { Photo } from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { AlertProvider } from '../../providers/alert/alert';

@Component({
    selector: 'page-view-market',
    templateUrl: 'view-market.html',
})
export class ViewMarketPage {

    market: Market;
    map: any;
    @ViewChild('map') mapElement: ElementRef;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private apiProvider: ApiServiceProvider,
        public loading: LoadingController,
        public alertProvider: AlertProvider,


    ) {
        this.market =  new Market();
        this.market.setId(navParams.get("marketId"))
        this.market.addPhoto(new Photo(0, 'assets/img/image.png'), 0);

        this.loadMarket()
    }

    private loadMarket(){
        this.apiProvider.getMarket(this.market.getId()).subscribe(
          res => {
            let data = res.json();
            data = data.result
            this.market.setName(data.name)
            this.market.setDescription(data.description)
            this.market.setDate(new Date(data.startdate).toISOString())
            this.market.setId(data.id)
            this.market.setLat(data.lat)
            this.market.setLng(data.lon)
            this.initMap();
            this.loadPhotos();
        }, (err) => {
            console.log(err)
        }
        ); 
      }

      private loadPhotos() {
        this.apiProvider.getMarketPhotos(this.market.getId())
            .subscribe(res => {
                let data = res.json();
                let photos = data.result
                let length = data.count
                if (length > 0) {
                    photos.forEach((photo, index) => {
                    let photoEntity = new Photo(photo.id,photo.content);
                    this.market.addPhoto(photoEntity, index);
                    }, this);
                }

            }, (err) => {
                console.log(err)
            });
    }
    
    ionViewDidLoad(): void {
        window['mapInit'] = () => {
            this.loadMarket();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyDlRrMhhZXm-uhLM6XYAa4EWKdqgDSPPQk&callback=mapInit&libraries=places';

        document.body.appendChild(script);
    }

    initMap() {
        if (google || google.maps) {

            var latLng = new google.maps.LatLng(Number(this.market.getLat()), Number(this.market.getLng()));

            var zoom = 10;

            let mapOptions = {
                center: latLng,
                zoom: zoom,
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
            }
            );

            marker.bindTo('position', this.map, 'center');
        }
    }
}
