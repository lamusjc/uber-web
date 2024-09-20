import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart';
import { CartService } from './cart.service';
import { ToolbarComponent } from '../toolbar/toolbar';
import { FormCartComponent } from './form_cart/form_cart';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: HomePage }]),
    CartRoutingModule,
    FlexLayoutModule,
    DragDropModule
  ],
  declarations: [CartComponent, FormCartComponent, ToolbarComponent],
  providers: [CartService]
})
export class CartModule { }
