import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';

@Injectable()
export class ApiServiceProvider {

  private baseUrl: string;
  private radio : number;
  constructor(public http: Http) {
     this.radio = 100
     this.baseUrl = 'http://45.77.216.232:8080';
  }

  public getOptions() {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    return new RequestOptions({ headers: headers});
  }

  public getMarkets(page = 0) {

    let lat = localStorage.getItem('lat')
    let lon = localStorage.getItem('lon')

    console.log('Getting markets lat:' + lat + ' lon: ' + lon + ' page: ' + page);
    

    return this.http.get(`${this.baseUrl}/public/market?lat=${lat}&lon=${lon}&radio=${this.radio}&page=${page}`);
  }

  public getMyMarkets() {
    console.log('Getting markets for current user');
    return this.http.get(`${this.baseUrl}/private/market?token=${this.getToken()}`);
  }

  public getMarket(marketId: number) {
    console.log('Getting market with id ');
    return this.http.get(`${this.baseUrl}/public/market/${marketId}?token=${this.getToken()}`);
  }

  public getMarketFirstPhoto(id: number) {
    return this.http.get(`${this.baseUrl}/public/market/${id}/photo`)
  }

  public getMarketPhotos(id: number){
    return this.http.get(`${this.baseUrl}/public/market/${id}/photos`)
  }

  public getMarketComments(id: number){
    return this.http.get(`${this.baseUrl}/public/market/${id}/comment`)
  }

  public removeMarketComment(market: Market, commentId) {
    return this.http.delete(
      `${this.baseUrl}/private/market/${market.getId()}/comment/${commentId}?token=${this.getToken()}`,
      this.getOptions()
    );
  }

  public addMarketComment(market: Market,content) {
    let postParams = {
      market_id: market.getId(),
      content: content,
    }

    return this.http.post(`${this.baseUrl}/private/market/${market.getId()}/comment?token=${this.getToken()}`,
      postParams,
      this.getOptions()
    );

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

  public editMarket(market: Market) {
    let postParams = {
      id : market.getId(),
      name: market.getName(),
      description: market.getDescription(),
      startdate: market.getDate(),
      lat: market.getLat(),
      lon: market.getLng(),
    }

    return this.http.post(`${this.baseUrl}/private/market/${market.getId()}/edit?token=${this.getToken()}`,
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

  public deleteMarketPhotos(market: Market) {
    return this.http.delete(
      `${this.baseUrl}/private/market/${market.getId()}/photo?token=${this.getToken()}`,
      this.getOptions()
    )
  }

  private getToken(){
    return localStorage.getItem('token');
  }
}