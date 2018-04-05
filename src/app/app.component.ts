import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy,
    
  ) {
    this.initializeApp();
    this.translate = translate;

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
    ];

  }
  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Platform is ready')
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    this.geolocation.getCurrentPosition().then((position) => {
      console.log('Gettin current location')
      console.log(position.coords)
      if(position.coords){
      localStorage.setItem("lat", position.coords.latitude.toString())
      localStorage.setItem("lon", position.coords.longitude.toString())
    }
    }).catch((error) => {
      this.requestlocation()
    });


    let watch = this.geolocation.watchPosition();
      watch.subscribe((position) => {
        console.log('Subscribing to location')
        console.log(position.coords)
        if(position.coords){
          localStorage.setItem("lat", position.coords.latitude.toString())
          localStorage.setItem("lon", position.coords.longitude.toString())
        }
    });
    
  this.statusBar.styleDefault();
  this.splashScreen.hide();
  this.translate.setDefaultLang('es');
    });
  }
  
  requestlocation(){
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      console.log('Requesting location privileges')
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }
  
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
