import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  baseUrl: string = environment.API_URL;

  constructor(private httpClient: HttpClient) { }


  getOrders(email: string,  pageNumber: number, pageSize: number):Observable<GetOrderHistory> {

    const orderSearchUrl = `${this.baseUrl}/orders/search/findByCustomerEmail?email=${email}&page=${pageNumber}&size=${pageSize}`;

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
