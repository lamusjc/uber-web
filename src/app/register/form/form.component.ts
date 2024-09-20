import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, ActionSheetController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoadingService } from 'src/services/loading.service';

import { File } from '@ionic-native/File/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { RegisterService } from '../register.service';

@Component({
  selector: 'form-register-component',
  templateUrl: 'form.html',
  styleUrls: ['form.scss']
})
export class FormRegisterComponent {
  firstName: any;
  lastName: any;
  username: any;
  password: any;
  form: FormGroup;
  isReady: boolean = true;
  image: any;

  constructor(private loadingService: LoadingService, private alertController: AlertController, private formBuilder: FormBuilder, private registerService: RegisterService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController) {
    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: ['', Validators.required],
      coords: ['', Validators.required],
      users_photo: [''],
      role_id: ['2', Validators.required],
      vehicle_brand: ['', Validators.nullValidator],
      vehicle_year: ['', Validators.nullValidator],
      vehicle_license: ['', Validators.nullValidator],
      vehicle_color: ['', Validators.nullValidator],
    })
  }

  updateValidators(event) {
    if (event.target.value == 3) {
      this.form.get('users_photo').setValidators(Validators.required);
      this.form.get('vehicle_brand').setValidators(Validators.required);
      this.form.get('vehicle_year').setValidators(Validators.required);
      this.form.get('vehicle_license').setValidators(Validators.required);
      this.form.get('vehicle_color').setValidators(Validators.required);
    } else {
      this.form.get('users_photo').setValidators(Validators.required);
      this.form.get('vehicle_brand').setValidators(Validators.nullValidator);
      this.form.get('vehicle_year').setValidators(Validators.nullValidator);
      this.form.get('vehicle_license').setValidators(Validators.nullValidator);
      this.form.get('vehicle_color').setValidators(Validators.nullValidator);

      this.form.get('users_photo').setValue('');
      this.form.get('vehicle_brand').setValue('');
      this.form.get('vehicle_year').setValue('');
      this.form.get('vehicle_license').setValue('');
      this.form.get('vehicle_color').setValue('');
    }
  }

  async uploadImage(arr?) {

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
      form.get('users_photo').setValue(file);
    }).catch(err => {
      this.isReady = true;
    });
  }


  processForm(event) {
    event.preventDefault();
    this.loadingService.present();
    this.registerService.registerUser(this.form.value).subscribe((res: any) => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `OK`,
        message: `<b> ${res.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then((alert) => {
        alert.present().finally(() => {
          this.router.navigate(['/login']);
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
