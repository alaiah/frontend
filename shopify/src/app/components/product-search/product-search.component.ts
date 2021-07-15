import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
  }

  searchProducts(keyword: string) {
    return this.route.navigateByUrl(`/search/${keyword}`);

  }


}
