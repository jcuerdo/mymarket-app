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
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { User } from '../models/user';
import { Deeplinks } from '@ionic-native/deeplinks';
import { MarketPage } from '../pages/market/market';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'markets';

  publicPages: Array<{title: string, component: any}>;
  privatePages: Array<{title: string, component: any}>;
  pages: Array<{title: string, component: any}>;
  user : User = null

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public events: Events,
    public firebase: Firebase,
    public apiProvider: ApiServiceProvider,
    public deepLinks: Deeplinks,
  ) {
    this.translate = translate;
    this.initializeApp();
  }

  private generateMenuPages() {
    this.user = this.getUser()

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
          this.registerFirebase()
          this.user = this.getUser()
        });
        this.events.subscribe('user:modified', () => {
          this.pages = this.publicPages.concat(this.privatePages);
          this.registerFirebase()
          this.user = this.getUser()
        });
        this.events.subscribe('user:logout', () => {
          this.pages = this.publicPages;
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          localStorage.removeItem('userFullName')
          localStorage.removeItem('userPhoto')
          this.user = null;
          this.pages = this.publicPages.concat({ title: this.translate.instant('Login/Register'), component: LoginPage });
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
    this.registerRoutes();
    this.translate.setDefaultLang('es');
  });
  }

  registerRoutes(){
    this.deepLinks.route({
      'market/:marketId': MarketPage,
    }).subscribe((match) => {
      console.log(match);
      this.nav.push('market', { marketId: match.$args.marketId });
    },
    (nomatch) => {
      console.log(nomatch);
    });
  }

  registerFirebase(){
    try {
      this.firebase.getToken().then(token => {
        console.log(token);
        this.apiProvider.updateUserFirebaseToken(token).subscribe(data=>{
          console.log(JSON.stringify(data))
        },error=>{
          console.log('ERROR')
          console.log(JSON.stringify(error))
        });
      });
      this.firebase.onNotificationOpen().subscribe( data => {
        //IF TAB SINO TOSTADA
        console.log(JSON.stringify(data))
        this.nav.push('market', { marketId: data.marketID });
      });
    } catch(exception){
      console.log(exception)
    }
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.events.publish('user:logout')

  }

  getUser(){
    if(localStorage.getItem('userId') == null){
      return null;
    }
    var user = new User();
    user.$id =  parseInt(localStorage.getItem('userId'))
    user.$photo = localStorage.getItem('userPhoto') 
    user.$fullname = localStorage.getItem('userFullName') 

    return user;
   }
}
