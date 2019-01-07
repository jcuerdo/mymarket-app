import { MyaccountPage } from './../myaccount/myaccount';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
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
    public translate : TranslateService,
    public events : Events
    ) {
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(fromRegister : boolean = false){

    if (this.email != null && this.email != "" && this.password && this.password != "") {
      this.apiProvider.loginUser(this.email, this.password)
      .subscribe(res => {
          let data = res.json();  
          console.log('Logging...')
          console.log(data)
          if (data.result) {    
             localStorage.setItem('token', data.result)
             localStorage.setItem('userId', data.userId)
          }
          this.events.publish('user:login');
          if(fromRegister){
            this.navCtrl.setRoot(MyaccountPage)
          } else{
            this.navCtrl.setRoot(HomePage)
          }
      }, (err) => {
        this.alertProvier.presentAlert(this.translate.instant("Error"), this.translate.instant("Invald email or/and password"))
          console.log(err)
      });
    } else {
      this.alertProvier.presentAlert(this.translate.instant("Error"), this.translate.instant("Email and passowrd are mandtory parameters"))
    }
  }

  register(){
    if (this.email != null && this.email != "" && this.password && this.password != "") {
      this.apiProvider.addUser(this.email, this.password).subscribe(
        res =>{
          console.log(res)
          if(res.status == 201) {
            this.login(true)
          }
        }, (err) => {
          console.log(err);          
          if(err.status == 409) {
            this.alertProvier.presentAlert(this.translate.instant("Error"), this.translate.instant("This email is alrady in use, try with another one"))
          }
        }
      );
    } else{
      this.alertProvier.presentAlert(this.translate.instant("Error"), this.translate.instant("Email and passowrd are mandtory parameters"))
    }
  }

}
