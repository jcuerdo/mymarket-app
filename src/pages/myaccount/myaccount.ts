import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Events } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { User } from '../../models/user';
import { ToastproviderProvider } from '../../providers/toastprovider/toastprovider';
import { TranslateService } from '@ngx-translate/core';
import { CameraOptions, Camera } from '@ionic-native/camera';

@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {

  user : User

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider : ApiServiceProvider,
    private toastProvider : ToastproviderProvider,
    public actionSheetCtrl: ActionSheetController,
    public translate: TranslateService,
    private camera: Camera,
    public events: Events,

  ) {
    this.user = new User()
    this.user.$photo = 'assets/img/user.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyaccountPage');
    this.apiProvider.getUser().subscribe(
      res => {
        console.log(res)
        let data = res.json().result;
        this.user.$id = data.id
        this.user.$email = data.email
        this.user.$description = data.description
        this.user.$fullname = data.fullname
        this.user.$password = data.password
        this.user.$role = data.role
        this.user.$photo = data.photo
      }, (err) => {
        console.log(err)
          this.toastProvider.presentToast("Error loading user data")
      }
    );
  }

  saveDetails(){
    console.log('ionViewDidLoad MyaccountPage');
    this.apiProvider.updateUser(this.user).subscribe(
      res => {
        localStorage.setItem('userId', this.user.$id.toString())
        localStorage.setItem('userPhoto', this.user.$photo) 
        localStorage.setItem('userFullName', this.user.$fullname) 
        this.events.publish('user:login');
        console.log(res)
        this.toastProvider.presentToast("Your datas has been succesfully modified")
      }, (err) => {
        if( err.status == 409) {
          this.toastProvider.presentToast("This email already exists")
        } 
        else if (err.status = 304) {
          this.toastProvider.presentToast("Nothing to modify")
        }
      }
    );
  }

  uploadPhotoAlert(element) {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant("Select origin"),
      buttons: [
        {
          text: this.translate.instant("Camera"),
          handler: () => {
            this.uploadPhoto(element);
          }
        },{
          text: this.translate.instant("Gallery"),
          handler: () => {
            this.uploadPhoto(element, this.camera.PictureSourceType.PHOTOLIBRARY);
            let fileInputs: HTMLCollection = document.getElementsByClassName('cordova-camera-select');
            let lastInput : HTMLElement = fileInputs.item(fileInputs.length - 1) as HTMLElement;
            lastInput.click();
          }
        },{
            text: this.translate.instant("Delete"),
            handler: () => {
              element.srcElement.src = 'assets/img/user.png';
              this.user.$photo = 'assets/img/user.png';
            }
        }
      ]
    });
    actionSheet.present();
  }

uploadPhoto(element, source = this.camera.PictureSourceType.CAMERA) : void {

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
       element.srcElement.src = base64ImageUrl;
       this.user.$photo = base64ImageUrl;
      }, (err) => {
       console.log(err);
      });
}
}
