import { MymarketsPage } from './../pages/mymarkets/mymarkets';
import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../pages/home/home';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { Firebase } from '@ionic-native/firebase';

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
    public firebase: Firebase
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

    if(this.firebase){
      this.firebase.getToken().then(token => {
        console.log(token)
      });
  
      this.firebase.onNotificationOpen().subscribe( data => {
        console.log(JSON.stringify(data))
        alert('PEPIYO')
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
