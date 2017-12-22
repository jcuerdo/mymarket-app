import { Component, ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {Market} from '../../models/market';
import { ViewMarketPage } from '../view-market/view-market';


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
  ) {
    this.markets = navParams.get('markets');
  }

  private ionViewDidLoad(): void {
    
            window['mapInit'] = () => {
                this.initMap();
            }
    
            let script = document.createElement("script");
            script.id = "googleMaps";
            script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyDlRrMhhZXm-uhLM6XYAa4EWKdqgDSPPQk&callback=mapInit&libraries=places';
    
            document.body.appendChild(script);
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

              var infowindow = new google.maps.InfoWindow({
                content: element.name
              });

              marker.addListener('click', function(this) {
                infowindow.open(t.map, marker)
                t.view(element)
              });
            });
            }
      }

      view(marketData) {
        let market = new Market();
        market.setId(marketData.id);
        market.setName(marketData.name);
        market.setDescription(marketData.description);
        market.setDate(marketData.startDate);
        market.setLat(marketData.lat);
        market.setLng(marketData.lon);
    
        this.navCtrl.push(ViewMarketPage, { market: market });
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
