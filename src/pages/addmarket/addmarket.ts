import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,ActionSheetController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { ViewMarketPage } from '../view-market/view-market';
import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from '../../providers/alert/alert';
import { MapboxProvider } from '../../providers/mapbox/mapbox';


@Component({
    selector: 'page-add-market',
    templateUrl: 'addmarket.html'
})
export class AddMarketPage {
    position: any;
    map: any;
    autocompleteService: any;
    
    market: Market;
    photosToUpload : number
    
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
        public alertProvider: AlertProvider,
        private mapboxProvider : MapboxProvider,
       
        
    ) {
        this.market = new Market();
        this.market.addPhoto(new Photo(0, 'assets/img/camera.png'), 0);
        this.market.addPhoto(new Photo(1, 'assets/img/camera.png'), 1);
        this.market.addPhoto(new Photo(2, 'assets/img/camera.png'), 2);
        this.market.addPhoto(new Photo(3, 'assets/img/camera.png'), 3);
    }

    ionViewDidLoad() {
        let lat = localStorage.getItem('lat')
        let lon = localStorage.getItem('lon')
    
        var point = [lon,lat];
        var zoom = 10;
    
        let map = this.mapboxProvider.createMap(point, zoom)
        let marker = this.mapboxProvider.createMarker(point, map, true)
        
        map.on('moveend', function() {
            marker.setLngLat(map.getCenter())
        });

        this.mapboxProvider.createSearch(map, 'searchPlace')

        this.map = map

    }

    saveMarket(): void {

        let loader = this.loading.create({
            content: this.translate.instant("Saving market information"),
        });
        loader.present().then(() => {

            this.market.setLat(this.map.getCenter().lat);
            this.market.setLng(this.map.getCenter().lng);

            this.apiProvider.saveMarket(this.market)
                .subscribe(res => {
                    let data = res.json().result;
                    this.market.setId(data.id);
                    this.photosToUpload = this.market.getPhotos().length
                    this.checkAllPhotosUploaded(loader);
                    this.market.getPhotos().forEach(function(element) {              
                      if(element.getContent() && element.getContent() != 'assets/img/camera.png'){
                        this.apiProvider.saveMarketPhoto(this.market,element)
                          .subscribe(res => {
                            this.photosToUpload--;
                            this.checkAllPhotosUploaded(loader);
                          }, (err) => {
                            this.photosToUpload--;
                            this.checkAllPhotosUploaded(loader);
                            this.alertProvider.presentAlert('Error', this.translate.instant('Image upload fail'));
                          });                             
                        } else{
                            this.photosToUpload--;
                            this.checkAllPhotosUploaded(loader);
                          }
                    },this);               
                }, (err) => {
                    loader.dismiss();
                    this.alertProvider.presentAlert('Error', err);
                });
        });
    }

    private checkAllPhotosUploaded(loader) {
        if (this.photosToUpload <= 0) {
          loader.dismiss();
          this.navCtrl.pop();
          this.navCtrl.push(ViewMarketPage, { marketId: this.market.getId() });
        }
      }

    uploadPhotoAlert(element,index) {
        let actionSheet = this.actionSheetCtrl.create({
          title: this.translate.instant("Select origin"),
          buttons: [
            {
              text: this.translate.instant("Camera"),
              handler: () => {
                this.uploadPhoto(element,index);
              }
            },{
              text: this.translate.instant("Gallery"),
              handler: () => {
                this.uploadPhoto(element,index,this.camera.PictureSourceType.PHOTOLIBRARY);
                let fileInputs: HTMLCollection = document.getElementsByClassName('cordova-camera-select');
                let lastInput : HTMLElement = fileInputs.item(fileInputs.length - 1) as HTMLElement;
                lastInput.click();
              }
            },{
                text: this.translate.instant("Delete"),
                handler: () => {
                    this.market.addPhoto(new Photo(index,'assets/img/camera.png'), index);
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
           let photo = new Photo(index,base64ImageUrl);
           this.market.addPhoto(photo,index);
           element.srcElement.src = base64ImageUrl;
          }, (err) => {
           console.log(err);
          });
    }

}
