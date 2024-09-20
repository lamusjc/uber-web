import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from 'src/services/loading.service';
import { Camera } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { UrlService } from 'src/services/url.service';
import { LoginService } from 'src/app/login/login.service';
import { DriverService } from '../driver.service';

@Component({
    selector: 'app-form-driver',
    templateUrl: 'form_driver.html',
    styleUrls: ['form_driver.scss']
})
export class FormDriverComponent {
    form: FormGroup;
    driver: any;
    values: any;

    constructor(private alertController: AlertController, public urlService: UrlService, public route: ActivatedRoute, public toastController: ToastController, private localNotifications: LocalNotifications, private loginService: LoginService, private router: Router, private camera: Camera, private filePath: FilePath, private file: File, private platform: Platform, private actionSheetController: ActionSheetController, private menu: MenuController, private formBuilder: FormBuilder, private loadingService: LoadingService, private driverService: DriverService) {
        this.form = this.formBuilder.group({

        });

        this.values = this.driverService.getValues();

        this.driverService.subscribe(res => {
            if ('get_driver') {
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
        this.driver = [];
        this.driverService.getDriver().subscribe((res: any) => {
            this.driver = res.data;
            this.driver.map((value, i) => {
                this.driver[i].users_photo = value.users_photo ? this.urlService.getUrl() + value.users_photo : 'http://spootmedia.com/wp-content/uploads/2018/06/443809727.jpg';
            });
        }, err => {
            // console.log(err);
        });
    }

    goProducts() {
        this.router.navigate(['/products_users']);
    }

    acceptDriver(id) {
        this.loadingService.present();
        this.driverService.updateDriver({ users_id: id }).subscribe((res: any) => {
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