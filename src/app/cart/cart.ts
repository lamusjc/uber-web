import { Component } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.html',
  styleUrls: ['cart.scss']
})
export class CartComponent {

  constructor(private cartService: CartService) {


  }

  ionViewWillEnter() {
    this.cartService.renderAgain('get_cart');
  }

}