import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, MenuController, ActionSheetController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoadingService } from 'src/services/loading.service';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { UrlService } from 'src/services/url.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'get-products-component',
  templateUrl: 'get_products.html',
  styleUrls: ['get_products.scss']
})
export class GetProductsComponent {

  form: FormGroup;
  data: any;
  place: any;
  isReady = true;
  image: any;

  constructor(private loadingService: LoadingService, private menu: MenuController, private urlService: UrlService, private alertController: AlertController, private formBuilder: FormBuilder, private productsService: ProductsService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController) {
    this.form = this.formBuilder.group({
      products_edit: this.formBuilder.array([]),
    })
    this.productsService.subscribe(res => {
      if (res == 'get_products') {
        this.getProducts();
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

  getProducts() {
    this.data = [];
    this.productsService.getProducts().subscribe((res: any) => {
      const control = <FormArray>this.form.controls['products_edit'];
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i);
      }

      var formProductsEdit = this.form.controls['products_edit'] as FormArray;
      this.data = res.data;
      this.data.map((value, i) => {
        this.data[i].products_photo = this.urlService.getUrl() + value.products_photo;
      });
      this.data.map((value, i) => {
        formProductsEdit.push(this.createItem(value.place_id, value.products_id, value.products_name, value.products_price, value.products_photo, value.products_deleted));
      });

    }, err => {
      // console.log(err);
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

  modifyProducts(data) {
    this.loadingService.present();
    this.productsService.updateProducts(data.value).subscribe((res: any) => {
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

  deleteProducts(data) {
    this.loadingService.present();
    this.productsService.deleteProducts(data.value.products_id).subscribe((res: any) => {
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

}