import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../pages/home/home';
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
    this.translate = translate;
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Platform is ready')
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    this.translate.onDefaultLangChange.subscribe(res => {
      this.loadMenu();
    });
    this.translate.setDefaultLang('es');
    });
  }

  private loadMenu() {
    this.publicPages = [
      { title: this.translate.instant('Markets'), component: HomePage },
    ];
    this.privatePages = [
      { title: this.translate.instant('My account'), component: MyaccountPage },
    ];
    if (!localStorage.getItem("token")) {
      this.pages = this.publicPages.concat({ title: this.translate.instant('Login'), component: LoginPage });
    }
    else {
      this.pages = this.publicPages.concat(this.privatePages);
    }
    this.events.subscribe('user:login', () => {
      console.log(this.translate.instant('Login'));
      this.pages = this.publicPages.concat(this.privatePages);
    });
    this.events.subscribe('user:logout', () => {
      this.pages = this.publicPages;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
