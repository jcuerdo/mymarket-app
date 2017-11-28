import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Market } from '../../models/market';
import { Http } from '@angular/http';
import { Photo } from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

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
    ) {
        this.market =  navParams.get("market");

        if(this.market.getPhotos().length == 0){
            let photoEntity = new Photo();
            photoEntity.setContent('assets/img/image.png');
            this.market.addPhoto(photoEntity, null);
        }
    }

    ngOnInit(): void {
        this.loadPhotos();
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


    private loadPhotos() {
        this.apiProvider.getMarketPhotos(this.market.getId())
            .subscribe(res => {
                let data = res.json();
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
