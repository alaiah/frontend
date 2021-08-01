import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl: string = environment.API_URL;


  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number, pageNumber: number, pageSize: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${theCategoryId}&page=${pageNumber}&size=${pageSize}`;

    console.log(`URL: ${searchUrl}`);
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getCategories(): Observable<ProductCategory[]> {

    const productCategoryUrl: string = `${this.baseUrl}/product-category`;
    return this.httpClient.get<GetResponseCategory>(productCategoryUrl).pipe(
      map(response => response._embedded.productCategory)

    )
  }


  searchProducts(keyword: string, pageNumber: number, pageSize: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProductDetails(productId: number): Observable<Product> {


    const productDetailUrl: string = `${this.baseUrl}/products/${productId}`;
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
