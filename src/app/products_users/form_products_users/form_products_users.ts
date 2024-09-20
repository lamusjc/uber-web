import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoadingService } from 'src/services/loading.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { UrlService } from 'src/services/url.service';
import { LoginService } from 'src/app/login/login.service';
import { ProductsUsersService } from '../products_users.service';

@Component({
  selector: 'app-form-products_users',
  templateUrl: 'form_products_users.html',
  styleUrls: ['form_products_users.scss']
})
export class FormProductsUsers {
  form: FormGroup;
  products: any;
  values: any;

  constructor(private alertController: AlertController, public route: ActivatedRoute, private urlService: UrlService, public toastController: ToastController, private localNotifications: LocalNotifications, private loginService: LoginService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController, private menu: MenuController, private formBuilder: FormBuilder, private loadingService: LoadingService, private productsUsersService: ProductsUsersService) {
    this.values = this.productsUsersService.getValues();

    this.productsUsersService.subscribe(res => {
      if (res == 'get_products_users') {
        this.getProducts();
      }
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your notification has been save.',
      duration: 3000
    });
    toast.present();
  }

  getProducts() {
    this.products = [];
    const place_id = this.route.snapshot.paramMap.get('place_id');
    this.productsUsersService.getProducts(place_id).subscribe((res: any) => {
      this.products = res.data;
      this.products.map((value, i) => {
        this.products[i].products_photo = value.products_photo ? this.urlService.getUrl() + value.products_photo : 'http://spootmedia.com/wp-content/uploads/2018/06/443809727.jpg';
      });
    }, err => {
      // console.log(err);
    });
  }

  addCart(products_id) {
    this.loadingService.present();
    const body = {
      products_id: products_id
    }
    this.productsUsersService.addCart(body).subscribe((res: any) => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Status ${res.status}`,
        message: `<b> ${res.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
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

  goProducts() {
    this.router.navigate(['/products_users']);
  }

}
