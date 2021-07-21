import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors } from "@angular/forms";
import { OktaAuthService } from "@okta/okta-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CheckoutService } from "../services/checkout.service";

@Injectable({ providedIn: 'root' })

export class ServerSideValidator {

    static checkUniqueEmail(checkoutService: CheckoutService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
          return checkoutService.isEmailUnique(control.value).pipe(map((result: boolean) => result ? {notLoggedIn: true} : {createAccount: true})
          );
        };
      }
    

}



/*
export class ServerSideValidator implements AsyncValidator {

    constructor(private httpClient: HttpClient) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {


        const myUrl = `http://localhost:8080/api/customers/search/doesCustomerExists?email=${control.value}`;
        const obs = this.httpClient.get<boolean>(myUrl)
            .pipe(
                map((isUsed) => {
                    // null no error, object for error
                    return !isUsed ? null : {
                        instrumentationNameValidator: 'Name exists already.'
                    };
                })
            );

        return obs;

    }


}

*/

/*

import {ZipcodeService} from './zipcode.service';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class ZipcodeValidator {
  static createValidator(zipcodeService: ZipcodeService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return zipcodeService.fakeHttp(control.value).pipe(
        map((result: boolean) => result ? null : {invalidAsync: true})
      );
    };
  }
}

*/