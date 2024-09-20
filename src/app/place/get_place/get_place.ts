import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ActionSheetController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/services/loading.service';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { UrlService } from 'src/services/url.service';
import { PlaceService } from '../place.service';

@Component({
  selector: 'get-place-component',
  templateUrl: 'get_place.html',
  styleUrls: ['get_place.scss']
})
export class GetPlaceComponent {

  form: FormGroup;
  image: any;
  data: any;
  isReady: any = true;


  constructor(private loadingService: LoadingService, private menu: MenuController, private urlService: UrlService, private alertController: AlertController, private formBuilder: FormBuilder, private placeService: PlaceService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController) {
    this.form = this.formBuilder.group({
      place_name: ['', Validators.required],
      place_phone: ['', Validators.required],
      place_address: ['', Validators.required],
      place_coords: ['', Validators.required],
      place_photo: [''],
      place_edit: this.formBuilder.array([]),
    })
    this.placeService.subscribe(res => {
      if (res == 'get_place') {
        this.getPlace();
      }
    })
  }

  getPlace() {
    this.data = [];
    this.placeService.getPlace().subscribe((res: any) => {
      const control = <FormArray>this.form.controls['place_edit'];
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i);
      }

      var formPlaceEdit = this.form.controls['place_edit'] as FormArray;
      this.data = res.data;

      this.data.map((value, i) => {
        this.data[i].place_photo = this.urlService.getUrl() + value.place_photo;
      });
      this.data.map((value, i) => {
        formPlaceEdit.push(this.createItem(value.place_id, value.place_name, value.place_phone, value.place_address, value.place_coords, value.place_photo, value.place_deleted));
      });

    }, err => {
      // console.log(err);
    });
  }

  createItem(id, name, phone, address, coords, photo, deleted) {
    return this.formBuilder.group({
      place_id: [id, Validators.required],
      place_name: [name, Validators.required],
      place_phone: [phone, Validators.required],
      place_address: [address, Validators.required],
      place_coords: [coords, Validators.required],
      place_photo: [photo],
      place_deleted: [deleted],
    });
  }

  modifyPlace(data) {
    this.loadingService.present();
    this.placeService.updatePlace(data.value).subscribe((res: any) => {
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
    }, err => {
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

  deletePlace(data) {
    this.loadingService.present();
    this.placeService.deletePlace(data.value.place_id).subscribe((res: any) => {
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
    }, err => {
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

}