import { FormControl, ValidationErrors } from "@angular/forms";
import { CheckoutService } from "../services/checkout.service";


export class ShopifyValidators {

    static onlyWhitespace(formControl: FormControl): ValidationErrors {

        if ((formControl.value != null) && (formControl.value.trim().length === 0)) {

            return { "onlyWhitespace": true };
        } else {
            return null;
        }
     }

}
