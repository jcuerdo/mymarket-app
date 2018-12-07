import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the GooglemapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GooglemapsProvider {

  public loadGoogleMapsAndInit(callback)
  {
    if (!document.getElementById('googleMaps')) {
      window['mapInit'] = () => {
        callback();
      }
      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyDlRrMhhZXm-uhLM6XYAa4EWKdqgDSPPQk&callback=mapInit&libraries=places';
      document.body.appendChild(script);
  } else {
    callback()
  }
  }

}
