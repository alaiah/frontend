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
  error: Error;


  constructor(private oktaAuth: OktaAuthService, private cartService: CartService) { 
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.getUserDetails();
    });
  }
  

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  }


  getUserDetails() {

    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(

        res => {
          this.userFullName = res.given_name;
          this.loggedInUserEmail = res.email;
        }
      )
    }
  }

  async login() {
    try {
      await this.oktaAuth.signInWithRedirect({ originalUri: '/' });
    } catch (err) {
      console.error(err);
      this.error = err;
    }
  }


  async logout() {
    await this.oktaAuth.signOut();
  }
}


