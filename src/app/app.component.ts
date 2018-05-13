import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MyaccountPage } from '../pages/myaccount/myaccount';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  publicPages: Array<{title: string, component: any}>;
  privatePages: Array<{title: string, component: any}>;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public events: Events
  ) {
    this.initializeApp();
    this.translate = translate;

    // used for an example of ngFor and navigation
    this.publicPages = [
      { title: this.translate.instant('Home'), component: HomePage },
    ];

    this.privatePages = [
      { title: this.translate.instant('My account'), component: MyaccountPage },
    ];

    if(!localStorage.getItem("token")){
      this.rootPage = LoginPage
      this.pages = this.publicPages;
    } else{
      this.pages = this.publicPages.concat(this.privatePages);

    }

    events.subscribe('user:login', () => {
      this.pages = this.publicPages.concat(this.privatePages);
    });

    events.subscribe('user:logout', () => {
      this.pages = this.publicPages;
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Platform is ready')
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
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
