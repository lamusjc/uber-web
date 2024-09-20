import { Component, Input } from '@angular/core';
import { MenuController, AlertController, ActionSheetController, Platform, ToastController, NavController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoadingService } from 'src/services/loading.service';
import { HomeService } from './home.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { LoginService } from '../login/login.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { UrlService } from 'src/services/url.service';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

declare let cordova: any;
const STORAGE_KEY = 'image';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  form: FormGroup;
  place: any;
  values: any;
  map: GoogleMap;
  marker: Marker;
  modal = false;
  Opacity: any = 1;

  constructor(private alertController: AlertController, public modalController: ModalController, public toastController: ToastController, private urlService: UrlService, private localNotifications: LocalNotifications, private loginService: LoginService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController, private menu: MenuController, private formBuilder: FormBuilder, private loadingService: LoadingService, private homeService: HomeService) {
    this.form = this.formBuilder.group({
    });

    
  }
  
  ionViewWillEnter() {
    this.values = this.homeService.getValues();
    this.getPlace();
    // this.loadMap();

    // this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
    //   (data) => {
    //     console.log(data[0]);
    //     this.moveMarker(data[0]);
    //   }
    // );
  }

  ionViewWillLeave() {
    document.querySelectorAll('._gmaps_cdv_').forEach((node) => {
      node.classList.remove('_gmaps_cdv_');
    });
  }

  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904, // default location
          lng: -89.3809802 // default location
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        // Now you can use all methods safely.
        this.getPosition();
      })
      .catch(error => {
      
      });

  }

  moveMarker(position) {
    this.marker.remove();
    this.map.addMarker({
      title: 'Position',
      icon: 'blue',
      animation: 'DROP',
      position: position
    }).then((value: Marker) => {
      this.marker = value;
    });
  }
  getPosition(): void {
    this.map.getMyLocation()
      .then(response => {
        this.map.moveCamera({
          target: response.latLng
        });
        this.map.addMarker({
          title: 'Position',
          icon: 'blue',
          animation: 'DROP',
          position: response.latLng
        }).then((value: Marker) => {
          this.marker = value;
        });

      })
      .catch(error => {
  
      });
  }

  async seeCoords(position) {
    this.modal = true;
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'ltnLng': position,
      },
      showBackdrop: false
    });
    modal.onDidDismiss().then((data) => {
      this.modal = false;
      this.Opacity = 1;
    })
    this.Opacity = 0;
    return await modal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your notification has been save.',
      duration: 3000
    });
    toast.present();
  }


  logout() {
    this.loadingService.present();
    this.homeService.logout().subscribe((res: any) => {
      this.loadingService.dismiss();
      this.loginService.isAuthenticated = false;
      this.router.navigate(['/login']);
    }, err => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
      this.router.navigate(['/login']);
    });
  }

  getPlace() {
    this.place = [];
    this.homeService.getPlace().subscribe((res: any) => {
      this.place = res.data

      this.place.map((value, i) => {
        this.place[i].place_photo = value.place_photo ? this.urlService.getUrl() + value.place_photo : 'http://spootmedia.com/wp-content/uploads/2018/06/443809727.jpg';
      });

    }, err => {
      // console.log(err);
    });
  }

  goProducts(place_id) {
    this.router.navigate(['/products_users/' + place_id]);
  }

}

@Component({
  selector: 'modal-page',
  templateUrl: 'modal-example.html',
  styleUrls: ['home.page.scss']
})
export class ModalPage {
  @Input() ltnLng: any;
  map: GoogleMap;

  constructor(private modalController: ModalController) {
    this.loadMap();

  }
  dismissModal() {

    this.modalController.dismiss();

  }

  ionViewWillLeave() {
    document.querySelectorAll('._gmaps_cdv_').forEach((node) => {
      node.classList.remove('_gmaps_cdv_');
    });
  }

  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904, // default location
          lng: -89.3809802 // default location
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_modal', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        // Now you can use all methods safely.
        this.getPosition();
      })
      .catch(error => {
     
      });

  }

  getPosition(): void {
    this.map.getMyLocation()
      .then(response => {
        this.map.moveCamera({
          target: response.latLng
        });
        this.map.addMarker({
          title: 'Position',
          icon: 'blue',
          animation: 'DROP',
          position: response.latLng
        });

      })
      .catch(error => {
    
      });
  }

}