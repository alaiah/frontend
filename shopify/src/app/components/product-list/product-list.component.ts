import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  pageSize: number = 10;
  pageNumber: number = 1;
  totalElements: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.listProducts();

    });
 
  }


  listProducts() {
    
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      let keyword = this.route.snapshot.paramMap.get('keyword');
      this.productService.searchProducts(keyword, this.pageNumber - 1, this.pageSize).subscribe(
        data => {
          this.products = data._embedded.products;

          this.pageSize = data.page.size;
          this.pageNumber = data.page.number + 1;
          this.totalElements = data.page.totalElements;
        }

      )
    } else {
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
        if (hasCategoryId) {
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
        } else {
          this.currentCategoryId = 1;        
        }

        this.productService.getProductList(this.currentCategoryId, this.pageNumber - 1, this.pageSize).subscribe(
          data => {
            this.products = data._embedded.products;

            this.pageSize = data.page.size;
            this.pageNumber = data.page.number + 1;
            this.totalElements = data.page.totalElements;
          }
    
        )
     }


   }


   addItemtoCart(theProduct: Product) {

    let cartItem: CartItem = new CartItem(theProduct);

    this.cartService.addToCart(cartItem);
   }

   updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;

    this.listProducts();

   }


   getValue(event: Event): number {
    let value = +((event.target as HTMLInputElement).value);
    return value;
  }
}
