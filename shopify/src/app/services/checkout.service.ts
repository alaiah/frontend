import { HttpClient } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../common/customer';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  //orderTrackingNumber: string;

 
  constructor(private httpClient: HttpClient) { }



  savePurchaseOrder(purchaseOrder: Purchase): Observable<any> {

    const checkoutUrl = `http://localhost:8080/api/checkout/purchase`;
    return this.httpClient.post<Purchase>(checkoutUrl, purchaseOrder);


  }

  getCustomerDetails(email: string): Observable<Customer> {

    const myUrl = `http://localhost:8080/api/customers/search/findByEmail?email=${email}`;
    return this.httpClient.get<Customer>(myUrl);

  }

  isEmailUnique(email: string) : Observable<boolean> {

    // const myUrl = `http://localhost:8080/api/customers/search/doesCustomerExists?email=${email}`;
    const myUrl = `http://localhost:8080/api/generic/isExistingCustomer?email=${email}`;

    return this.httpClient.get<boolean>(myUrl);
   }
}
