import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AddMarketPage } from '../addmarket/addmarket';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public lista = [];
  public aviso = "";
  constructor(public navCtrl: NavController, public http: Http,public loading: LoadingController) {
    this.lista = [];

    let loader = this.loading.create({
      content: '',
    });

    loader.present().then(() => {
      this.http.get('http://mimercadillo.com/market?token=1234567890')
          .subscribe(res => {
            this.lista = res.json();
            loader.dismiss();
          }, (err) => {
            console.log(err);
          });
    });



  }

  public view (item){
    this.navCtrl.push(AddMarketPage);
  }

  public add (){
    this.navCtrl.push(AddMarketPage);
  }

}
