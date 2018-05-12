import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { HomePage } from '../home/home';
import { AlertProvider } from '../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email : string;
  password : string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider : ApiServiceProvider,
    public alertProvier : AlertProvider,
    public translate : TranslateService
    ) {
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){

    if (this.email != null && this.email != "" && this.password && this.password != "") {
      this.apiProvider.loginUser(this.email, this.password)
      .subscribe(res => {
          let data = res.json();
          console.log(data.result)
          if (data.result) {
             localStorage.setItem('token', data.result)
          }
          this.navCtrl.setRoot(HomePage)
      }, (err) => {
        this.alertProvier.presentAlert(this.translate.instant("Error"), this.translate.instant("Invald email or/and password"))
          console.log(err)
      });
    } else {
      this.alertProvier.presentAlert(this.translate.instant("Error"), this.translate.instant("Email and passowrd are mandtory parameters"))
    }
  }

  register(){

    
  }

}
