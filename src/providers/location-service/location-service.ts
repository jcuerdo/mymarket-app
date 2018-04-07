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
    this.onDevice = this.platform.is('cordova');
  }

  public subscribeToLocation(){
    let watch = this.geolocation.watchPosition();
    watch.subscribe((position) => {
      console.log('Subscribing to location')
      console.log(position.coords)
      if(position.coords){
        localStorage.setItem("lat", position.coords.latitude.toString())
        localStorage.setItem("lon", position.coords.longitude.toString())
      }
  });
  }
  
  public requestLocation(callback, errorCallback){
    console.log('Trying to obtain location')
    if(localStorage.getItem('lat') && localStorage.getItem('lat')){
      console.log('Lacation already set in local storage')
      this.subscribeToLocation()
      callback()
    } else{
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
    this.geolocation.getCurrentPosition().then((position) => this.setPosition(position, callback)).catch((error) => {
      console.log('ERROR getting current location', JSON.stringify(error) )
      errorCallback(error)
    });
  }


  private setPosition(position,callback){
    console.log('Storing location on local storage')
    console.log(position.coords)
    localStorage.setItem("lat", position.coords.latitude.toString())
    localStorage.setItem("lon", position.coords.longitude.toString())

    console.log('Calling callback')
    callback(position)
  }

}
