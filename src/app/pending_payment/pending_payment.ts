import { Component } from '@angular/core';
import _ from 'lodash';
import { PendingPaymentService } from './pending_payment.service';

@Component({
  selector: 'app-pending-payment',
  templateUrl: 'pending_payment.html',
  styleUrls: ['pending_payment.scss']
})
export class PendingPaymentComponent {

  constructor(private pendingPaymentService: PendingPaymentService) {
  }

  ionViewWillEnter() {
    this.pendingPaymentService.renderAgain('get_pending_orders');
  }


}