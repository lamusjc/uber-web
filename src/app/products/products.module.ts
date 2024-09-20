import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsService } from './products.service';
import { ToolbarComponent } from '../toolbar/toolbar';
import { CreateProductsComponent } from './create_products/create_products';
import { GetProductsComponent } from './get_products/get_products';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([{ path: '', component: RegisterComponent }]),
    ProductsRoutingModule,
  ],
  declarations: [ProductsComponent, CreateProductsComponent, GetProductsComponent, ToolbarComponent],
  providers: [ProductsService]
})
export class ProductsModule {}
