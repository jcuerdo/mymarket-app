import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Market } from '../../models/market';
import { Http } from '@angular/http';
import { Photo } from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage()
@Component({
    selector: 'page-view-market',
    templateUrl: 'view-market.html',
})
export class ViewMarketPage {

    market: Market;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private apiProvider: ApiServiceProvider,
    ) {
        let marketData = navParams.get("market");
        this.market = new Market();
        this.market.setId(marketData.id);
        this.market.setName(marketData.name);
        this.market.setDescription(marketData.description);
        this.market.setDate(marketData.startDate);

        let photoEntity = new Photo();
        photoEntity.setContent('../../assets/img/image.png');
        this.market.addPhoto(photoEntity, null);
    }

    ngOnInit(): void {
        this.loadPhotos();
    }


    private loadPhotos() {
        this.apiProvider.getMarketPhotos(this.market.getId())
            .subscribe(res => {
                let photos = res.json();
                if (photos) {
                    this.market.clearPhotos();
                    photos.forEach((photo, index) => {
                        let photoEntity = new Photo();
                        photoEntity.setId(photo.id);
                        photoEntity.setContent(photo.content);
                        this.market.addPhoto(photoEntity, index);
                    }, this);
                }
            }, (err) => {
            });
    }
}
