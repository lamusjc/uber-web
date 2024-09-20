import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoadingService } from 'src/services/loading.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { UrlService } from 'src/services/url.service';
import { CartService } from '../cart.service';
import { LoginService } from 'src/app/login/login.service';

@Component({
    selector: 'app-form-cart',
    templateUrl: 'form_cart.html',
    styleUrls: ['form_cart.scss']
})
export class FormCartComponent {
    form: FormGroup;
    cart: any;
    values: any;
    total_price: any = 0;

    constructor(private alertController: AlertController, public urlService: UrlService, public route: ActivatedRoute, public toastController: ToastController, private localNotifications: LocalNotifications, private loginService: LoginService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController, private menu: MenuController, private formBuilder: FormBuilder, private loadingService: LoadingService, private cartService: CartService) {
        this.form = this.formBuilder.group({

        });

        this.values = this.cartService.getValues();

        this.cartService.subscribe(res => {
            if ('get_cart') {
                this.getCart();
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

    getCart() {
        this.cart = [];
        this.cartService.getCart().subscribe((res: any) => {
            this.cart = res.data;
            this.cart.map((value, i) => {
                this.cart[i].products_photo = this.urlService.getUrl() + value.products_photo;
                this.total_price = this.total_price + value.products_price;
            });
        }, err => {
            // console.log(err);
        });
    }

    goProducts() {
        this.router.navigate(['/products_users']);
    }

    process() {
        this.loadingService.present();
        this.cartService.addPayment({ arr: this.cart }).subscribe((res: any) => {
            this.loadingService.dismiss();
            this.alertController.create({
                header: `Status ${res.status}`,
                message: `<b> ${res.message} </b>`,
                buttons: [{
                    text: 'OK'
                }]
            }).then(alert => { alert.present(); this.getCart(); });
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

    deleteCart(cart_id) {
        this.loadingService.present();
        this.cartService.deleteCart(cart_id).subscribe((res: any) => {
            this.loadingService.dismiss();
            this.alertController.create({
                header: `Status ${res.status}`,
                message: `<b> ${res.message} </b>`,
                buttons: [{
                    text: 'OK'
                }]
            }).then(alert => { alert.present(); this.getCart(); });
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