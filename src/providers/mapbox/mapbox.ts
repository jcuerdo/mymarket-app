import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import mapboxgl from 'mapbox-gl';
import mapboxglg from 'mapbox-gl-geocoder';

/*
  Generated class for the MapboxProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapboxProvider {

private apiKey : string = 'pk.eyJ1Ijoiam9jdWFsIiwiYSI6ImNqcWZkb2JhZDAzNWgzeG85dXE1MWIxcTAifQ.vBzlr0tOmEmJCvRUUOri0w';

public createMap(point, zoom, container = "map") {
  mapboxgl.accessToken = this.apiKey;
  var map = new mapboxgl.Map({
  style: 'mapbox://styles/mapbox/streets-v9',
  center: point,
  zoom: zoom,
  container: container,
  });


map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

  return map;
}

public createEmptyMap() {
  var g = document.createElement('div');
  g.setAttribute("id", "fakemap");

  mapboxgl.accessToken = this.apiKey;
  var map = new mapboxgl.Map({
  container: g,
  });

  return map;
}

public createMarker(point, map, draggable = false) {
  let el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundImage = 'url(assets/img/market.png)';
  el.style.backgroundSize = '32px';
  el.style.width = '32px';
  el.style.height = '32px';

  let marker = new mapboxgl.Marker(el, {draggable: draggable})
  .setLngLat(point)
  .addTo(map);

  return marker;
}

public setPopUpFromDiv(marker, div){
  marker.setPopup(new mapboxgl.Popup().setDOMContent(div));
  return marker;
}

public createSearch(map ,id){
  let geocoder = new mapboxglg({
    accessToken: this.apiKey,
    placeholder: "Traduceme please"
});

document.getElementById(id).appendChild(geocoder.onAdd(map));

return geocoder;

}

}
