import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';

@Injectable()
export class ApiServiceProvider {

  baseUrl: string = 'http://ec2-18-195-137-171.eu-central-1.compute.amazonaws.com:8080';
  private token : string;
  private radio : number;
  constructor(public http: Http) {
     this.radio = 100
  }


  public getOptions() {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    return new RequestOptions({ headers: headers });
  }

  public getMarkets() {
    let lat = localStorage.getItem('lat')
    let lon = localStorage.getItem('lon')

    console.log('Getting markets lat:' + lat + ' lon: ' + lon);

    return this.http.get(`${this.baseUrl}/public/market?token=${this.getToken()}&lat=${lat}&lon=${lon}&radio=${this.radio}`);
  }

  public getMarketFirstPhoto(id: number) {
    return this.http.get(`${this.baseUrl}/public/market/${id}/photo?token=${this.getToken()}`)
  }

  public getMarketPhotos(id: number){
    return this.http.get(`${this.baseUrl}/public/market/${id}/photos?token=${this.getToken()}`)
  }

  public saveMarket(market: Market) {
    let postParams = {
      name: market.getName(),
      description: market.getDescription(),
      startdate: market.getDate(),
      lat: market.getLat(),
      lon: market.getLng(),
    }

    return this.http.post(`${this.baseUrl}/private/market?token=${this.getToken()}`,
      postParams,
      this.getOptions()
    );

  }

  public loginUser(email: string, password: string) {
    let postParams = {
      email: email,
      password: password,
    }
    return this.http.post(
      `${this.baseUrl}/public/user/login`,
      postParams,
      this.getOptions()
    )
  }

  public addUser(email: string, password: string) {
    let postParams = {
      email: email,
      password: password,
    }
    return this.http.post(
      `${this.baseUrl}/public/user/create`,
      postParams,
      this.getOptions()
    )
  }

  public getUser() {
    return this.http.get(
      `${this.baseUrl}/private/user?token=${this.getToken()}`
    )
  }

  public saveMarketPhoto(market: Market, photo: Photo) {
    let postParams = {
      id: market.getId(),
      content: photo.getContent(),
    }
    return this.http.post(
      `${this.baseUrl}/private/market/${market.getId()}/photo?token=${this.getToken()}`,
      postParams,
      this.getOptions()
    )
  }

  private getToken(){
    return localStorage.getItem('token') ? localStorage.getItem('token') : '1234567890';
  }
}