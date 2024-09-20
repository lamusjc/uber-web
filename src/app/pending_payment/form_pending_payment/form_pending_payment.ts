import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoadingService } from 'src/services/loading.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';;
import { UrlService } from 'src/services/url.service';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { LoginService } from 'src/app/login/login.service';
import { PendingPaymentService } from '../pending_payment.service';

declare let cordova: any;
const STORAGE_KEY = 'image';
@Component({
  selector: 'app-form-pending_payment',
  templateUrl: 'form_pending_payment.html',
  styleUrls: ['form_pending_payment.scss']
})
export class FormPendingPaymentComponent {
  form: FormGroup;
  payment: any;
  values: any;
  total_price: any = 0;
  options: DocumentViewerOptions = {
    title: 'My PDF'
  }

  constructor(private alertController: AlertController, private file: File, private transfer: FileTransfer, private document: DocumentViewer, public urlService: UrlService, public route: ActivatedRoute, public toastController: ToastController, private localNotifications: LocalNotifications, private loginService: LoginService, private router: Router, private camera: Camera, private filePath: FilePath, private platform: Platform, private actionSheetController: ActionSheetController, private menu: MenuController, private formBuilder: FormBuilder, private loadingService: LoadingService, private pendingPaymentService: PendingPaymentService) {
    this.form = this.formBuilder.group({

    });

    this.pendingPaymentService.subscribe(res => {
      if ('get_pending_orders') {
        this.getPayment();
        this.values = this.pendingPaymentService.getValues();
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
  seePDF(url) {
    this.document.viewDocument(url, 'application/pdf', {})
  }

  chat(bill_id, buyer, driver) {
    this.router.navigate(['chat/' + bill_id + '/' + buyer + '/' + driver]);
  }

  getPayment() {
    this.payment = [];
    this.pendingPaymentService.getPayment().subscribe((res: any) => {
      this.payment = res.data;
      this.payment.map((value, i) => {
        this.payment[i].detail.map((value2, j) => {
          this.payment[i].detail[j].products_photo = this.urlService.getUrl() + value2.products_photo;
          this.payment[i].detail[j].place_photo = this.urlService.getUrl() + value2.place_photo;
        })
      });
    }, err => {
      // console.log(err);
    });
  }

  goProducts() {
    this.router.navigate(['/products_users']);
  }



  // deleteCart(cart_id) {
  //   this.loadingService.present();
  //   this.paymentService.deleteCart(cart_id).subscribe((res: any) => {
  //     this.loadingService.dismiss();
  //     this.alertController.create({
  //       header: `Status ${res.status}`,
  //       message: `<b> ${res.message} </b>`,
  //       buttons: [{
  //         text: 'OK'
  //       }]
  //     }).then(alert => { alert.present(); this.getCart(); });
  //   }, err => {
  //     this.loadingService.dismiss();
  //     this.alertController.create({
  //       header: `Error ${err.error.status}`,
  //       message: `<b> ${err.error.message} </b>`,
  //       buttons: [{
  //         text: 'OK'
  //       }]
  //     }).then(alert => alert.present());
  //   });
  // }

}