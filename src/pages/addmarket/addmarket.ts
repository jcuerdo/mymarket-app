import { Component ,ViewChild,ElementRef} from '@angular/core';
import { NavController, NavParams,ModalController } from 'ionic-angular';
import { LocationSelectPage } from '../location-select/location-select';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

@Component({
  selector: 'page-add-market',
  templateUrl: 'addmarket.html'
})
export class AddMarketPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public modalCtrl: ModalController,
      public maps: GoogleMapsProvider,
  ) {

  }

    launchLocationPage(){

        let modal = this.modalCtrl.create(LocationSelectPage);

        modal.onDidDismiss((location) => {
            if(location){
                let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {                
                    this.maps.setLocation(location);
                    this.maps.map.setCenter(location);
                  });    
            }
        });

        modal.present();

    }




}
