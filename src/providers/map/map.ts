import { Injectable, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';


@Injectable()
export class MapProvider {

  private loaded: boolean = false;
  private map: any;
  private mapElement: ElementRef;
  private autocompleteService: any;
  private placesService: any;

  constructor(
    public geolocation: Geolocation
  ) {

  }

  public createMap(mapElement): void {

    this.mapElement = mapElement;
    window['mapInit'] = () => {
      this.initMap();
    }

    let script = document.createElement("script");
    script.id = "googleMaps";

    script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyDlRrMhhZXm-uhLM6XYAa4EWKdqgDSPPQk&callback=mapInit&libraries=places';

    document.body.appendChild(script);

  }

  public initMap() {
    if (google || google.maps) {
      var latLng = new google.maps.LatLng(40.423504, -3.689432);
      var zoom = 10;

      let mapOptions = {
        center: latLng,
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      var marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: ''
      });

      marker.bindTo('position', this.map, 'center');
      this.createAutocompleteService();
      this.createPlacesService();
      this.loaded = true;
    }
  }

  private createAutocompleteService() {
    if (google && google.maps) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    }
  }

  private createPlacesService() {
    if (google && google.maps && this.map) {
      this.placesService = new google.maps.places.PlacesService(this.map);
    }
  }

  public changeMapPosition(position) {
    if (google && google.maps && this.map) {
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.setCenter(latLng);
    this.map.setZoom(15);
    }
  }

  public getPosition(): Promise<any> {
    return this.geolocation.getCurrentPosition();
  }

  public searchPlace(query) {
    if (query.length > 0 && this.loaded) {

      let config = {
        types: ['geocode'],
        input: query
      }

      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {

        if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {

          let places = [];

          predictions.forEach((prediction) => {
            places.push(prediction);
          });

          return places;
        }

      });

    }
    return [];
  }

  public selectPlace(place) {

    let location = {
      lat: null,
      lng: null,
      name: place.name
    };

    this.placesService.getDetails({ placeId: place.place_id }, (details) => {

      location.name = details.name;
      location.lat = details.geometry.location.lat();
      location.lng = details.geometry.location.lng();

      this.map.setCenter({ lat: location.lat, lng: location.lng });
    });

  }

  public getPlaceLocation(place) {

    let location = {
      lat: null,
      lng: null,
      name: place.name
    };

    this.placesService.getDetails({ placeId: place.place_id }, (details) => {

      location.name = details.name;
      location.lat = details.geometry.location.lat();
      location.lng = details.geometry.location.lng();
      return location;
    });
  }

  public getCenter(){
    return this.map.center;
  }
}
