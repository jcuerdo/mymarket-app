import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { User } from '../../models/user';

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
    public apiProvider : ApiServiceProvider
  ) {
    this.user = new User()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyaccountPage');
    this.apiProvider.getUser().subscribe(
      res => {
        console.log(res)
        let data = res.json().result;
        this.user.$email = data.email
        this.user.$description = data.description
        this.user.$fullname = data.fullname
        this.user.$password = data.password
        this.user.$role = data.role
        this.user.$photo = data.photo
      }, (err) => {
        console.log(err)
        //Alert with error
      }
    );
  }

}
