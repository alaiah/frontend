import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {


  orders: OrderHistory[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number;
  
  constructor(private orderHistoryService: OrderHistoryService, private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {
    
    this.getOrders();


  }

  async isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!(await this.oktaAuthService.tokenManager.get('accessToken'));
  }


  async getOrders() {


    const authenticated = await this.isAuthenticated();

    if (authenticated) {
      const userClaims = await this.oktaAuthService.getUser();

      this.orderHistoryService.getOrders(userClaims.email, this.pageNumber - 1, this.pageSize).subscribe(
        data => {
          this.orders = data._embedded.orders;

          console.log(JSON.stringify(this.orders));
          
          this.totalElements = data.page.totalElements
          this.pageNumber = data.page.number + 1;
          this.pageSize = data.page.size;
        });
      }
  
  }

  updatePageSize(size: number) {
    this.pageSize = size;

  }

  getValue(event: Event): number {
    let value = +((event.target as HTMLInputElement).value);
    return value;
  }


}
