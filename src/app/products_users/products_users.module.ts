import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductsUsers } from './products_users';
import { ProductsService } from '../products/products.service';
import { ProductsUsersRoutingModule } from './products-routing.module';
import { ToolbarComponent } from '../toolbar/toolbar';
import { FormProductsUsers } from './form_products_users/form_products_users';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: HomePage }]),
    ProductsUsersRoutingModule,
    FlexLayoutModule,
    DragDropModule
  ],
  declarations: [ProductsUsers, FormProductsUsers, ToolbarComponent],
  providers: [ProductsService]
})
export class ProductsUsersModule { }
