import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Market } from '../../models/market';
import { Photo } from '../../models/photo';

@Injectable()
export class ApiServiceProvider {

  //baseUrl: string = 'http://ec2-34-215-191-148.us-west-2.compute.amazonaws.com';
  baseUrl: string = 'http://localhost:8080';
  
  constructor(public http: Http) {

  }

  public getOptions() {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    return new RequestOptions({ headers: headers });
  }

  public getMarkets() {
    return this.http.get(this.baseUrl + '/public/market?token=1234567890');
  }

  public getMarketFirstPhoto(id: number) {
    return this.http.get(this.baseUrl + '/public/market/' + id + '/photo?token=1234567890')

  }

  public getMarketPhotos(id: number){
    return this.http.get(this.baseUrl + '/public/market/' + id + '/photos?token=1234567890')
  }

  public saveMarket(market: Market) {
    let postParams = {
      name: market.getName(),
      description: market.getDescription(),
      startdate: market.getDate(),
      lat: market.getLat(),
      lon: market.getLng(),
    }

    return this.http.post(
      this.baseUrl + '/private/market?token=1234567890',
      postParams,
      this.getOptions()
    );

  }

  public saveMarketPhoto(market: Market, photo: Photo) {
    let postParams = {
      id: market.getId(),
      content: photo.getContent(),
    }
    return this.http.post(
      this.baseUrl + '/private/market/photo?token=1234567890',
      postParams,
      this.getOptions()
    )
  }
}