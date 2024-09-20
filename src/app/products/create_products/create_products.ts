import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ActionSheetController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/services/loading.service';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { UrlService } from 'src/services/url.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'create-products-component',
  templateUrl: 'create_products.html',
  styleUrls: ['create_products.scss']
})
export class CreateProductsComponent {

  form: FormGroup;
  image: any;
  isReady: boolean = true;
  data: any;
  place: any;

  constructor(private loadingService: LoadingService, private menu: MenuController, private urlService: UrlService, private alertController: AlertController, private formBuilder: FormBuilder, private productsService: ProductsService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController) {
    this.form = this.formBuilder.group({
      place_id: ['', Validators.required],
      products_name: ['', Validators.required],
      products_price: ['', Validators.required],
      products_photo: [''],
    })
    this.productsService.subscribe(res => {
      if (res == 'get_place_2') {
        this.getPlace();
      }
    })
  }

  getPlace() {
    this.place = [];
    this.productsService.getPlace().subscribe((res: any) => {
      this.place = res.data;
      this.place.map((value, i) => {
        this.place[i].place_photo = this.urlService.getUrl() + value.place_photo;
      });
    }, err => {
      // console.log(err);
    });
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
      form.get('products_photo').setValue(file);
    }).catch(err => {
      this.isReady = true;
    });
  }

  createItem(place_id, products_id, name, phone, photo, deleted) {
    return this.formBuilder.group({
      place_id: [place_id, Validators.required],
      products_id: [products_id, Validators.required],
      products_name: [name, Validators.required],
      products_price: [phone, Validators.required],
      products_photo: [photo],
      products_deleted: [deleted],
    });
  }

  createProducts(event) {
    this.loadingService.present();
    const body = {
      place_id: this.form.get('place_id').value.place_id,
      products_name: this.form.get('products_name').value,
      products_photo: this.form.get('products_photo').value,
      products_price: this.form.get('products_price').value,
    }
    this.productsService.createProducts(body).subscribe((res: any) => {
      this.loadingService.dismiss();
      this.productsService.renderAgain('get_products');
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