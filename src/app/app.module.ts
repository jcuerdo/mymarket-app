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
import { ConnectivityService } from '../providers/connectivity-service/connectivity-service';

import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { HTTP } from '@ionic-native/http';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ApiServiceProvider } from '../providers/api-service/api-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddMarketPage,
    ViewMarketPage,
    MarketmapPage
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
    AddMarketPage,
    ViewMarketPage,
    MarketmapPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ConnectivityService,
    Network,
    Geolocation,
    LocationAccuracy,
    HTTP,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServiceProvider
  ]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}