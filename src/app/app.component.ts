import { MymarketsPage } from './../pages/mymarkets/mymarkets';
import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../pages/home/home';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { FCM } from '@ionic-native/fcm';

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
    public events: Events,
    public fcm: FCM
  ) {
    this.translate = translate;
    this.initializeApp();
  }

  private generateMenuPages() {
    this.translate.onDefaultLangChange.subscribe(
      res => {
        this.publicPages = [
          { title: this.translate.instant('Markets'), component: HomePage },
        ];
        this.privatePages = [
          { title: this.translate.instant('My account'), component: MyaccountPage },
          { title: this.translate.instant('My markets'), component: MymarketsPage },
        ];
        if (!localStorage.getItem("token")) {
          this.pages = this.publicPages.concat({ title: this.translate.instant('Login/Register'), component: LoginPage });
        }
        else {
          this.pages = this.publicPages.concat(this.privatePages);
        }
        this.events.subscribe('user:login', () => {
          this.pages = this.publicPages.concat(this.privatePages);
        });
        this.events.subscribe('user:logout', () => {
          this.pages = this.publicPages;
        });
      }
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
    console.log('Platform is ready')
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    this.generateMenuPages();
    this.translate.setDefaultLang('es');

    if(this.fcm){
      this.fcm.getToken().then(token => {
        console.log(token)
      });
  
      this.fcm.onNotification().subscribe( data => {
        console.log(JSON.stringify(data))
  
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
        }else{
          //Notification was received in foreground. Maybe the user needs to be notified.
        }
      });
    }

  });


  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
