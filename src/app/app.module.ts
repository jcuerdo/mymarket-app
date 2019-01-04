import { EditmarketPage } from './../pages/editmarket/editmarket';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddMarketPage } from '../pages/addmarket/addmarket';
import { ViewMarketPage } from '../pages/view-market/view-market';
import { MarketmapPage } from '../pages/marketmap/marketmap';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient} from '@angular/common/http';

import { HttpModule } from '@angular/http';
import { LocationServiceProvider } from '../providers/location-service/location-service';

import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { HTTP } from '@ionic-native/http';

import { Camera } from '@ionic-native/camera';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { LoginPage } from '../pages/login/login';
import { AlertProvider } from '../providers/alert/alert';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { MymarketsPage } from '../pages/mymarkets/mymarkets';

import { Firebase } from '@ionic-native/firebase';
import { GooglemapsProvider } from '../providers/googlemaps/googlemaps';
import { ViewUserPage } from '../pages/view-user/view-user';
import { ToastproviderProvider } from '../providers/toastprovider/toastprovider';
import { UserProvider } from '../providers/user/user';
import { MapboxProvider } from '../providers/mapbox/mapbox';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    AddMarketPage,
    ViewMarketPage,
    MarketmapPage,
    MyaccountPage,
    MymarketsPage,
    EditmarketPage,
    ViewUserPage,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AddMarketPage,
    ViewMarketPage,
    MarketmapPage,
    MyaccountPage,
    MymarketsPage,
    EditmarketPage,
    ViewUserPage,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocationServiceProvider,
    Network,
    Geolocation,
    LocationAccuracy,
    HTTP,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServiceProvider,
    AlertProvider,
    Firebase,
    GooglemapsProvider,
    ToastproviderProvider,
    UserProvider,
    MapboxProvider,
  ]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  console.log("Loading translations")
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}