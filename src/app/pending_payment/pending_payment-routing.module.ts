import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingPaymentComponent } from './pending_payment';

const routes: Routes = [
  {
    path: '',
    component: PendingPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingPaymentRoutingModule { }
