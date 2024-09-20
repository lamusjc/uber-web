import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToolbarComponent } from '../toolbar/toolbar';
import { PendingPaymentComponent } from './pending_payment';
import { PendingPaymentService } from './pending_payment.service';
import { PendingPaymentRoutingModule } from './pending_payment-routing.module';
import { FormPendingPaymentComponent } from './form_pending_payment/form_pending_payment';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: HomePage }]),
    PendingPaymentRoutingModule,
    FlexLayoutModule,
    DragDropModule
  ],
  declarations: [PendingPaymentComponent, ToolbarComponent, FormPendingPaymentComponent],
  providers: [PendingPaymentService]
})
export class PendingPaymentModule { }
