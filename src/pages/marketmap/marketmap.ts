import { Component, ViewChild,ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ViewMarketPage } from '../view-market/view-market';
import { GooglemapsProvider } from '../../providers/googlemaps/googlemaps';

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
    public googleMapsProvider: GooglemapsProvider,
  ) {
    this.markets = navParams.get('markets');
  }

  ionViewDidLoad(): void {    
    this.googleMapsProvider.loadGoogleMapsAndInit(this.initMap.bind(this))
  }
  initMap() {
    if (google || google.maps) {
      let lat = localStorage.getItem('lat')
      let lon = localStorage.getItem('lon')
      var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lon))                    

      let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.markets.forEach(element => {
        var latLng = new google.maps.LatLng(element.lat, element.lon);
        var marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: element.name,
            icon : {
                url: "assets/img/market.png",
                scaledSize: new google.maps.Size(32, 32)
            }
        });

        var t = this

        var infowindow = new google.maps.InfoWindow();
        marker.addListener('click', function(this) {
          var div = document.createElement('div');
          div.innerHTML = element.name;
          div.onclick = function(){t.view(element.id)};
          infowindow.setContent(div);
          infowindow.open(t.map, marker)

        });
      });
      }
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
