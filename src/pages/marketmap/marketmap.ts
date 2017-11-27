import { Component, ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


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
    public geolocation: Geolocation,
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
    
            this.geolocation.getCurrentPosition().then((position) => {
                this.position = position;
                if (this.map) {
                    var latLng = new google.maps.LatLng(this.position.coords.latitude, this.position.coords.longitude);
                    this.map.setCenter(latLng);
                    this.map.setZoom(15);

                    this.markets.forEach(element => {
                      var latLng = new google.maps.LatLng(element.lat, element.lon);
                      var marker = new google.maps.Marker({
                        position: latLng,
                        map: this.map,
                        title: element.title,
                        icon : {
                            url: "assets/img/market.png",
                            scaledSize: new google.maps.Size(32, 32)
                        }
                    });
                    });
                }
            }).catch((error) => {
                this.presentAlert('Error, location not available', error.message);            
            });
        }
        initMap() {
          if (google || google.maps) {
              if (this.position) {
                  var latLng = new google.maps.LatLng(this.position.coords.latitude, this.position.coords.longitude);
                  var zoom = 15;
              } else {
                  var latLng = new google.maps.LatLng(40.423504, -3.689432);
                  var zoom = 10;
              }
  
              let mapOptions = {
                  center: latLng,
                  zoom: zoom,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
              }
              this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            }
      }

      presentAlert(title : string, content: string) {
        const alert = this.alertCtrl.create({
          title: title,
          subTitle: content,
          buttons: ['Ok']
        });
        alert.present();
      }
}
