import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean;
  userFullName: string;
  loggedInUserEmail: string;

  constructor(private oktaAuthService: OktaAuthService, private cartService: CartService) { }

  ngOnInit(): void {

    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {

    if (this.isAuthenticated) {
      this.oktaAuthService.getUser().then(

        res => {
          this.userFullName = res.given_name;
          this.loggedInUserEmail = res.email;
        }
      )
    }
  }

  logout() {
    this.oktaAuthService.signOut();
  }

}
