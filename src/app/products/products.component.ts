import { Component } from '@angular/core';
import { ProductsService } from './products.service';


@Component({
  selector: 'products-component',
  templateUrl: 'products.html',
  styleUrls: ['products.scss']
})
export class ProductsComponent {

  constructor(private productsService: ProductsService) {
  }

  ionViewWillEnter() {
    this.productsService.renderAgain('get_place_2');
    this.productsService.renderAgain('get_products');
  }

}