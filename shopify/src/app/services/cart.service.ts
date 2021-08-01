import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';


@Injectable({
  providedIn: 'root'
})
export class CartService {


  
  storage: Storage = sessionStorage;

  cart: CartItem[] = [];

  totatPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { 
    let data = JSON.parse(this.storage.getItem("cart"));
    if (data != null) {

      this.cart = data;
      this.computeTotalValues();
    }


  }


  addToCart(theCartItem: CartItem) {

    let index = this.cart.findIndex(obj => obj.id === theCartItem.id);
    if (index > -1) {
      this.cart[index].quantity = this.cart[index].quantity + 1;
    } else {
      this.cart.push(theCartItem);
    }

    this.computeTotalValues();
  }

  decrementQuantity(theCartItem: CartItem) {

    let index = this.cart.findIndex(obj => obj.id === theCartItem.id);
    if (index > -1) {
      if (this.cart[index].quantity == 1) {
        this.cart.splice(index, 1);
      } else {
        this.cart[index].quantity = this.cart[index].quantity - 1;
      }
    }

    this.computeTotalValues();
  }


  deleteItem(theCartItem: CartItem) {

    let index = this.cart.findIndex(obj => obj.id === theCartItem.id);
    if (index > -1) {
      this.cart.splice(index, 1);
    }

    this.computeTotalValues();
  }



  computeTotalValues() {

    let tempTotalQuantity = 0;
    let tempTotalPrice = 0.0;

    for (let item of this.cart) {
      tempTotalQuantity += item.quantity;
      tempTotalPrice += item.quantity * item.unitPrice;
    }

    this.totalQuantity.next(tempTotalQuantity);
    this.totatPrice.next(tempTotalPrice);

    this.persistCartItems();

  }

  persistCartItems() {
    this.storage.setItem("cart", JSON.stringify(this.cart));
  }


  

}
