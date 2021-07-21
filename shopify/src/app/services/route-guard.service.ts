import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { CartItem } from '../common/cart-item';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})


export class RouteGuardService implements CanActivate {

  constructor(private _router:Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {


      return true;
  }
}



