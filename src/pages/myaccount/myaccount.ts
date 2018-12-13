import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { User } from '../../models/user';
import { ToastproviderProvider } from '../../providers/toastprovider/toastprovider';

@IonicPage()
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
    private toastProvider : ToastproviderProvider
  ) {
    this.user = new User()
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
}
