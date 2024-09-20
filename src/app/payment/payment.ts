import { Component } from '@angular/core';
import _ from 'lodash';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.html',
  styleUrls: ['payment.scss']
})
export class PaymentComponent {

  constructor(private paymentService: PaymentService) {
  }

  ionViewWillEnter() {
    this.paymentService.renderAgain('get_payment');
  }
}