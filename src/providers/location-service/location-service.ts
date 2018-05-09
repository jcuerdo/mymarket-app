import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';


declare var Connection;

@Injectable()
export class LocationServiceProvider {

  onDevice: boolean;

  constructor(
    public platform: Platform,
    public locationAccuracy: LocationAccuracy,
    public geolocation: Geolocation,

) {
    this.onDevice = this.platform.is('android') || this.platform.is('ios');
  }

  public subscribeToLocation(){
    console.log('Subscribing to location')
    let watch = this.geolocation.watchPosition();
    watch.subscribe((position) => {
      console.log('Location updated due to subscription')
      console.log(position.coords)
      if(position.coords){
        localStorage.setItem("currentlat", position.coords.latitude.toString())
        localStorage.setItem("currentlon", position.coords.longitude.toString())
      }
  });
  }
  
  public requestLocation(callback, errorCallback){
    this.subscribeToLocation()
    console.log('Requesting location')
    if(localStorage.getItem('lat') && localStorage.getItem('lat')){
      console.log('Lacation already set in local storage')
      callback()
    } else{
      console.log('Lacation not set in local storage')
      if(this.onDevice){
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          console.log('Requesting location accuracy')
          if(canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => this.getPosition(callback, errorCallback),
              error => {
                console.log('ERROR getting requesting location accuracy', JSON.stringify(error) )
                errorCallback(error)
              }
            );
          } else{
            this.getPosition(callback, errorCallback);
          }
        });
      } else{
        this.getPosition(callback, errorCallback)
      }
      ;  
    }
    
  }

  private getPosition(callback, errorCallback){
    console.log('Getting current position')

    this.geolocation.getCurrentPosition().then((position) => this.setPosition(position, callback)).catch((error) => {
      console.log('ERROR getting current location', JSON.stringify(error) )
      errorCallback(error)
    });
  }


  private setPosition(position,callback){
    console.log('Storing location on local storage')
    console.log(position.coords)
    localStorage.setItem("currentlat", position.coords.latitude.toString())
    localStorage.setItem("currentlon", position.coords.longitude.toString())

    localStorage.setItem("lat", position.coords.latitude.toString())
    localStorage.setItem("lon", position.coords.longitude.toString())

    console.log('Calling callback')
    callback(position)
  }

}
