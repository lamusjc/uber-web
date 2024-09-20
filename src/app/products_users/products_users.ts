import { Component } from '@angular/core';
import _ from 'lodash';
import { ProductsUsersService } from './products_users.service';

@Component({
  selector: 'app-products_users',
  templateUrl: 'products_users.html',
  styleUrls: ['products_users.scss']
})
export class ProductsUsers {

  constructor(private productsUsers: ProductsUsersService) {
  }

  ionViewWillEnter() {
    this.productsUsers.renderAgain('get_products_users');
  }
}