import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  constructor(private httpClient: HttpClient) { }


  getOrders(email: string,  pageNumber: number, pageSize: number):Observable<GetOrderHistory> {

    const orderSearchUrl = `http://localhost:8080/api/orders/search/findByCustomerEmail?email=${email}&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetOrderHistory>(orderSearchUrl);

  }
}

interface GetOrderHistory {

  _embedded: {

    orders: OrderHistory[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number

  }

}
