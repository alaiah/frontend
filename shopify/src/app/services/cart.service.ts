import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

 
  cart: CartItem[] = [];

  totatPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }


  addToCart(theCartItem: CartItem) {

    let index = this.cart.findIndex(obj => obj.id === theCartItem.id);
    if (index > -1) {
      this.cart[index].quantity = this.cart[index].quantity + 1;
     } else {
      this.cart.push(theCartItem);
     }

     this.computeTotalValues();
  }


  computeTotalValues() {

    let tempTotalQuantity = 0;
    let tempTotalPrice = 0.0;

    for(let item of this.cart) {
      tempTotalQuantity += item.quantity;
      tempTotalPrice += item.quantity * item.unitPrice;
    }

    this.totalQuantity.next(tempTotalQuantity);
    this.totatPrice.next(tempTotalPrice);
  }
 
}
