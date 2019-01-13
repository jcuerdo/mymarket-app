import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, IonicPage, Platform } from 'ionic-angular';
import { Market } from '../../models/market';
import { Http } from '@angular/http';
import { Photo } from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { AlertProvider } from '../../providers/alert/alert';
import { User } from '../../models/user';
import { ViewUserPage } from '../view-user/view-user';
import { UserProvider } from '../../providers/user/user';
import { MapboxProvider } from '../../providers/mapbox/mapbox';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'page-market',
    templateUrl: 'market.html',
})
@IonicPage({
    name: 'market',
    segment: 'market/:marketId',
    defaultHistory : ['markets']
})
export class MarketPage {
    tab : any = 'info'
    market: Market;
    map: any;
    comments : any[]
    assistances : any[]
    commentContent : string

    @ViewChild('map') mapElement: ElementRef;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modCtrl: ModalController,
        public http: Http,
        private apiProvider: ApiServiceProvider,
        public loading: LoadingController,
        public alertProvider: AlertProvider,
        public userProvider: UserProvider,
        private mapboxProvider : MapboxProvider,
        private socialSharing: SocialSharing,
        private translateService: TranslateService,
        public platform : Platform,

    ) {
        this.market = new Market();
        this.market.setId(navParams.get("marketId"))
        this.market.addPhoto(new Photo(0, 'assets/img/image.png'), 0);
    }

    private loadMarket(){
        this.apiProvider.getMarket(this.market.getId()).subscribe(
          res => {
            let data = res.json();
            data = data.result
            console.log(data)
            this.market.setName(data.name)
            this.market.setDescription(data.description)
            this.market.setDate(new Date(data.startdate).toISOString())
            this.market.setId(data.id)
            this.market.setLat(data.lat)
            this.market.setLng(data.lon)
            this.market.setType(data.type)
            this.market.setPlace(data.place)
            this.market.setFlexible(data.flexible)
            this.market.setGooglePlaceIdPlace(data.google_place_id)
            this.loadPhotos();
            this.loadOwner(data.user_id);
            this.initMap();
        }, (err) => {
            this.market.setId(0)
            console.log(err)
        }
        ); 
      }

      ionViewDidLoad(): void {
        this.loadMarket()
      }


      private loadPhotos() {
        this.apiProvider.getMarketPhotos(this.market.getId())
            .subscribe(res => {
                let data = res.json();
                let photos = data.result
                let length = data.count
                if (length > 0) {
                    photos.forEach((photo, index) => {
                    let photoEntity = new Photo(index,photo.content);
                    this.market.addPhoto(photoEntity, index);
                    }, this);
                }

            }, (err) => {
                console.log(err)
            });
    }

    private loadOwner(userId: number) {
        this.apiProvider.getPublicUser(userId)
            .subscribe(res => {
                let data = res.json().result;

                let owner = new User();
                owner.$id = data.id;
                owner.$email = data.email;
                owner.$fullname = data.fullname;
                owner.$photo = data.photo;
                owner.$description = data.description;
                this.market.setOwner(owner);
            }, (err) => {
                console.log(err)
            });
    }

    public viewUser(userId: number){
        let profileModal = this.modCtrl.create(ViewUserPage, { userId: userId });
        profileModal.onDidDismiss(data => {
        });
        profileModal.present();    
    }
    

    initMap() {
        var point = [(this.market.getLng()), (this.market.getLat())];
        var zoom = 16;

        let map = this.mapboxProvider.createMap(point, zoom)

        this.mapboxProvider.createMarker(point, map, false)
    }

    loadComments(){
        this.apiProvider.getMarketComments(this.market.getId()).subscribe(
            result => {
                this.comments = result.json().result;
            },err=>{
                
            }
        );
    }

    addComment(){
        this.apiProvider.addMarketComment(this.market,this.commentContent).subscribe(
            result => {
                this.loadComments()
            },
            err => {}
        );
    }

    removeComment(id){
        this.apiProvider.removeMarketComment(this.market, id).subscribe(
            result => {
                this.loadComments()
            },
            err => {}
        );
    }

    loadAssistance(){
        this.apiProvider.getMarketAssistance(this.market.getId()).subscribe(
            result => {
                this.assistances = result.json().result;
                console.log(this.assistances)
            },err=>{
                
            }
        );    
    }

    addAssistance(){
        this.apiProvider.addMarketAssistance(this.market).subscribe(
            result => {
                this.loadAssistance()
            },
            err => {}
        );
    }

    removeAssistance(id){
        this.apiProvider.removeMarketAssistance(this.market, id).subscribe(
            result => {
                this.loadAssistance()
            },
            err => {}
        );
    }

    share(){
        this.socialSharing.share(
            this.market.getName(), 
            this.getSharingText(), 
            this.market.getPhotos()[0].getContent(), 
            this.getMarketUrl()
            ).then(() => {
            console.log('SUCCESS')
        }).catch((err) => {
            console.log(err)
          });
    }

    getBaseUrl(){
        return `http://mymarketathome.com:8100`
    }

    getMarketUrl(separator = "#"){
        return `${this.getBaseUrl()}/${separator}/market/${this.market.getId()}`
    }
    getSharingText(){
        return this.translateService.instant('Look at this market at mymarketathome.com');
    }

    getSharingTags(){
        return 'mymarketathome'
    }

    getTwitterUrl(){
        return `https://twitter.com/share?url=${this.getMarketUrl("%23")}&text=${this.getSharingText()}&hashtags=${this.getSharingTags()}`
    }

    getFacebookUrl(){
        return `http://www.facebook.com/sharer.php?u=${this.getMarketUrl()}`
    }

    getGooglePlusUrl(){
        return `https://plus.google.com/share?url=${this.getMarketUrl()}`
    }

    openPopUp(url){
        console.log(url);
        var newwindow=window.open(url,'name','height=400,width=400');
        if (window.focus) {
            newwindow.focus()
        }
            return false;
        }
    }

