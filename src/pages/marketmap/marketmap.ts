import { Component, ViewChild,ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ViewMarketPage } from '../view-market/view-market';
import { MapboxProvider } from '../../providers/mapbox/mapbox';

@Component({
  selector: 'page-marketmap',
  templateUrl: 'marketmap.html',
})
export class MarketmapPage {

  @ViewChild('map') mapElement: ElementRef;
  position: any;
  map: any;  
  markets:any;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private mapboxProvider : MapboxProvider,
  ) {
    this.markets = navParams.get('markets');
  }

  ionViewDidLoad(): void {
    let lat = localStorage.getItem('lat')
    let lon = localStorage.getItem('lon')

    var point = [lon,lat];
    var zoom = 10;

    let map = this.mapboxProvider.createMap(point, zoom, 'completemap')

    this.markets.forEach(element => {
      var marketPoint = [element.getLng(),element.getLat()];
      var marker = this.mapboxProvider.createMarker(marketPoint, map, false)

      var t = this
      var div = document.createElement('div');
      div.innerHTML = element.getName();
      div.onclick = function(){t.view(element.getId())};

      this.mapboxProvider.setPopUpFromDiv(marker,div)

    });
}

view(marketId) {    
  this.navCtrl.push(ViewMarketPage, { marketId: marketId });
}

presentAlert(title : string, content: string) {
  const alert = this.alertCtrl.create({
    title: title,
    subTitle: content,
    buttons: ['Ok']
  });
  alert.present();
}

closeModal() {
  this.navCtrl.pop();
}
}
