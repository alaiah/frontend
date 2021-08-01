import { HttpClient } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../common/customer';
import { Purchase } from '../common/purchase';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  //orderTrackingNumber: string;

  baseUrl: string = environment.API_URL;

  constructor(private httpClient: HttpClient) { }



  savePurchaseOrder(purchaseOrder: Purchase): Observable<any> {

    const checkoutUrl = `${this.baseUrl}/checkout/purchase`;
    return this.httpClient.post<Purchase>(checkoutUrl, purchaseOrder);


  }

  getCustomerDetails(email: string): Observable<Customer> {

    const myUrl = `${this.baseUrl}/customers/search/findByEmail?email=${email}`;
    return this.httpClient.get<Customer>(myUrl);

  }

  isEmailUnique(email: string) : Observable<boolean> {

    const myUrl = `${this.baseUrl}/generic/isExistingCustomer?email=${email}`;

    return this.httpClient.get<boolean>(myUrl);
   }
}
