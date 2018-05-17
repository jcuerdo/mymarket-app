import { ViewMarketPage } from './../view-market/view-market';
import { AlertProvider } from './../../providers/alert/alert';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the EditmarketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editmarket',
  templateUrl: 'editmarket.html',
})
export class EditmarketPage {

  market: Market;
  photosToUpload : number

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider: ApiServiceProvider,
    public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public alertProvider: AlertProvider,
    public loading: LoadingController,

  ) {
    this.market = new Market();
    this.market.addPhoto(new Photo(0, 'assets/img/camera.png'), 0);
    this.market.addPhoto(new Photo(1, 'assets/img/camera.png'), 1);
    this.market.addPhoto(new Photo(2, 'assets/img/camera.png'), 2);
    this.market.addPhoto(new Photo(3, 'assets/img/camera.png'), 3);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditmarketPage');
    this.loadMarket();
  }

  saveMarket(): void {
    let loader = this.loading.create({
        content: '',
    });

    loader.present().then(() => {

        //this.market.setLat(this.map.center.lat());
        //this.market.setLng(this.map.center.lng());

        this.apiProvider.editMarket(this.market)
            .subscribe(res => {
                let data = res.json().result;
                this.market.setId(data.id);
                this.apiProvider.deleteMarketPhotos(this.market)
                .subscribe(res => {
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
                  this.alertProvider.presentAlert('Error', this.translate.instant('Image updated fail'));
                 });              
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

  private loadMarket(){
    this.apiProvider.getMarket(this.navParams.get("marketId")).subscribe(
      res => {
        let data = res.json();
        data = data.result
        console.log(data)
        this.market.setName(data.name)
        this.market.setDescription(data.description)
        this.market.setDate(new Date(data.startdate).toISOString())
        this.market.setId(data.id)
        this.market.setLat(data.lat)
        this.market.setLng(data.lon)
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
            console.log(data)
            let photos = data.result
            let length = data.count
            if (length > 0) {
                photos.forEach((photo, index) => {
                    let photoEntity = new Photo(index,photo.content);
                    this.market.addPhoto(photoEntity, index);
                }, this);
            }
        }, (err) => {
            console.log(err)
        });
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
