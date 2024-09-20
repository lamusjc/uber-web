import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PaymentService } from './payment.service';
import { PaymentComponent } from './payment';
import { PaymentRoutingModule } from './payment-routing.module';
import { ToolbarComponent } from '../toolbar/toolbar';
import { FormPaymentComponent } from './form_payment/form_payment';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: HomePage }]),
    PaymentRoutingModule,
    FlexLayoutModule,
    DragDropModule
  ],
  declarations: [PaymentComponent, ToolbarComponent, FormPaymentComponent],
  providers: [PaymentService],
})
export class PaymentModule { }
