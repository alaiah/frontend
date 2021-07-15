import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private productCategoryUrl = 'http://localhost:8080/api/product-category';





  constructor(private httpClient: HttpClient ) { }

  getProductList(theCategoryId: number, pageNumber: number, pageSize: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
 }

  getCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseCategory>(this.productCategoryUrl).pipe(
      map(response => response._embedded.productCategory)

    )
  }


  searchProducts(keyword: string, pageNumber: number, pageSize: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProductDetails(productId: number): Observable<Product> {


    const productDetailUrl: string = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productDetailUrl);
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number

  }

}

interface GetResponseCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
