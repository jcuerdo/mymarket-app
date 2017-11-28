import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';

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
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(!localStorage.getItem('lat') || !localStorage.getItem('lat')){
        this.geolocation.getCurrentPosition().then((position) => {
          if(position.coords){
            localStorage.setItem("lat", position.coords.latitude.toString())
            localStorage.setItem("lon", position.coords.longitude.toString())
          }
        }).catch((error) => {
          //this.presentAlert('Error, location not available', error.message);            
        });
      }

    let watch = this.geolocation.watchPosition();
      watch.subscribe((position) => {
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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
