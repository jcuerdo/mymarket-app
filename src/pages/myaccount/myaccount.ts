import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {

  email : string
  name : string
  details : string

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider : ApiServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyaccountPage');
    //Load user details
  }

}
