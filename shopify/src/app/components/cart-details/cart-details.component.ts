import { Component, OnInit } from "@angular/core";
import { CartItem } from "src/app/common/cart-item";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart-details",
  templateUrl: "./cart-details.component.html",
  styleUrls: ["./cart-details.component.css"],
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.cart;

    this.cartService.totatPrice.subscribe((data) => {
      this.totalPrice = data;
    });
  }

  addToCart(item: CartItem) {
    this.cartService.addToCart(item);
  }

  decrementQuantity(item: CartItem) {
    this.cartService.decrementQuantity(item);
  }

  deleteItem(item: CartItem) {
    this.cartService.deleteItem(item);
  }
}
