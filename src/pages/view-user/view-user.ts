import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the ViewUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-user',
  templateUrl: 'view-user.html',
})
export class ViewUserPage {

  private user : User;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apiProvider: ApiServiceProvider,
    ) {
      this.user = new User();
      let userId = navParams.get('userId');
      this.loadUser(userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewUserPage');
  }

  public closeModal() {
    this.navCtrl.pop();
  }

  private loadUser(userId : number) {
    this.apiProvider.getPublicUser(userId)
        .subscribe(res => {
            let data = res.json().result;
            this.user.$id = data.id;
            this.user.$email = data.email;
            this.user.$fullname = data.fullname;
            this.user.$photo = data.photo;
            this.user.$description = data.description;

            console.log(this.user)

        }, (err) => {
            console.log(err)
        });
}

}
