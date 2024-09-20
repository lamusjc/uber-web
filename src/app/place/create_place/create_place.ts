import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, MenuController, ActionSheetController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoadingService } from 'src/services/loading.service';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { UrlService } from 'src/services/url.service';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker
} from '@ionic-native/google-maps';
import { PlaceService } from '../place.service';

@Component({
  selector: 'create-place-component',
  templateUrl: 'create_place.html',
  styleUrls: ['create_place.scss']
})
export class CreatePlaceComponent {

  form: FormGroup;
  image: any;
  isReady: boolean = true;
  map: GoogleMap;
  marker: Marker;
  isVisible = false;

  constructor(private loadingService: LoadingService, private menu: MenuController, private urlService: UrlService, private alertController: AlertController, private formBuilder: FormBuilder, private placeService: PlaceService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController) {
    this.form = this.formBuilder.group({
      place_name: ['', Validators.required],
      place_phone: ['', Validators.required],
      place_address: ['', Validators.required],
      place_coords: ['', Validators.required],
      place_photo: ['']
    })

    this.placeService.subscribe(res => {
      if (res == 'get_map') {
        this.loadMap('map_canvas_place');

        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
          (data) => {

            this.moveMarker(data[0]);
          }
        );
      }
    })
  }


  loadMap(id) {

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

    this.map = GoogleMaps.create(id, mapOptions);

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
    this.form.get('place_coords').setValue(position);
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
        this.form.get('place_coords').setValue(response.latLng);
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

  async uploadImage(arr?) {
    console.log(this.platform.platforms());
    if (this.platform.is('mobile')) {
      const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, arr);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, arr);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
        ]
      });
      await actionSheet.present();
    } else {
      console.log('Solo funciona usando un telefono!');
    }

  }

  takePicture(sourceType: PictureSourceType, arr?) {

    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.isReady = false;
      let path = (<any>window).Ionic.WebView.convertFileSrc(imageData);
      if (this.platform.is('mobile') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {

        this.filePath.resolveNativePath(imageData)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let name = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
            let fullPath = filePath;
            var json = {
              path: path,
              correctPath: correctPath,
              name: name,
              fullPath: fullPath
            };

            this.image = json;
            this.convertirB64(correctPath, name, arr);
          });

      } else {
        let correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        let name = imageData.substr(imageData.lastIndexOf('/') + 1);
        let fullPath = imageData;
        var json = {
          path: path,
          correctPath: correctPath,
          name: name,
          fullPath: fullPath
        };

        this.image = json;
        this.convertirB64(correctPath, name, arr);
      }
    }, (err) => {
      // Handle error
    });

  }

  convertirB64(pathDirectory, name, form?) {
    this.file.readAsDataURL(pathDirectory, name).then(file64 => {
      this.isReady = true;
      let fileWithoutExtension = ('' + file64 + '').replace(/^data:image\/(png|jpg);base64,/, '');
      let file = ('' + file64 + '');
      form.get('place_photo').setValue(file);
    }).catch(err => {
      this.isReady = true;
    });
  }

  createPlace() {
    this.loadingService.present();
    const body = {
      place_name: this.form.get('place_name').value,
      place_phone: this.form.get('place_phone').value,
      place_address: this.form.get('place_address').value,
      place_coords: this.form.get('place_coords').value,
      place_photo: this.form.get('place_photo').value,
    }
    this.placeService.createPlace(body).subscribe((res: any) => {
      this.loadingService.dismiss();
      this.placeService.renderAgain('get_place');
      this.alertController.create({
        header: `OK`,
        message: `<b> ${res.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then((alert) => {
        alert.present().finally(() => {
          // this.router.navigate(['/login']);
        });
      });

    }, (err) => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());

    });

  }

}