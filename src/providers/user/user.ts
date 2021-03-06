import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  public getCurrentUserId() {
    return localStorage.getItem('userId');
  }

  public getCurrentUserToken() {
    return localStorage.getItem('token');
  }
}
