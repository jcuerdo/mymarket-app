import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Market } from '../../models/market';
import { Http } from '@angular/http';
import { Photo } from '../../models/photo';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { AlertProvider } from '../../providers/alert/alert';
import { GooglemapsProvider } from '../../providers/googlemaps/googlemaps';
import { User } from '../../models/user';
import { ViewUserPage } from '../view-user/view-user';
import { UserProvider } from '../../providers/user/user';

@Component({
    selector: 'page-view-market',
    templateUrl: 'view-market.html',
})
export class ViewMarketPage {

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
        public googleMapsProvider: GooglemapsProvider,
        public userProvider: UserProvider,
    ) {
        this.market =  new Market();
        this.market.setId(navParams.get("marketId"))
        this.market.addPhoto(new Photo(0, 'assets/img/image.png'), 0);

        this.loadMarket()
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


            this.initMap();
            this.loadPhotos();
            this.loadOwner(data.user_id);

        }, (err) => {
            console.log(err)
        }
        ); 
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
        profileModal.present();    }
    
    ionViewDidLoad(): void {
        this.googleMapsProvider.loadGoogleMapsAndInit(this.initMap.bind(this))
    }

    initMap() {
        if (google || google.maps) {

            var latLng = new google.maps.LatLng(Number(this.market.getLat()), Number(this.market.getLng()));

            var zoom = 10;

            let mapOptions = {
                center: latLng,
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            var marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                title: '',
                icon : {
                    url: "assets/img/market.png",
                    scaledSize: new google.maps.Size(32, 32)
                }
            }
            );

            marker.bindTo('position', this.map, 'center');
        }
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

}
