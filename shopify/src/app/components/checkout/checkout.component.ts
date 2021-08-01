import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { OktaAuthService } from "@okta/okta-angular";
import { Country } from "src/app/common/country";
import { Order } from "src/app/common/order";
import { OrderItem } from "src/app/common/order-item";
import { Purchase } from "src/app/common/purchase";
import { State } from "src/app/common/state";
import { AlaiahFormService } from "src/app/services/alaiah-form.service";
import { CartService } from "src/app/services/cart.service";
import { CheckoutService } from "src/app/services/checkout.service";
import { ServerSideValidator } from "src/app/validators/server-side-validators";
import { ShopifyValidators } from "src/app/validators/shopify-validators";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  totalPrice: number;
  totalQuantity: number;

  //isAuthenticated: boolean;
  loggedInUserEmail: string;

  constructor(
    private formBuilder: FormBuilder,
    private alaiahFormService: AlaiahFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private oktaAuthService: OktaAuthService
  ) {}

  async ngOnInit() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopifyValidators.onlyWhitespace,
        ]),
        lastName: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl("", {
          validators: [
            Validators.required,
            Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),
          ],
          asyncValidators: ServerSideValidator.checkUniqueEmail(
            this.checkoutService
          ),
          updateOn: "blur",
        }),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopifyValidators.onlyWhitespace,
        ]),
        city: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopifyValidators.onlyWhitespace,
        ]),
        state: new FormControl("", [Validators.required]),
        zipCode: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopifyValidators.onlyWhitespace,
        ]),
        country: new FormControl("", [Validators.required]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopifyValidators.onlyWhitespace,
        ]),
        city: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopifyValidators.onlyWhitespace,
        ]),
        state: new FormControl("", [Validators.required]),
        zipCode: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopifyValidators.onlyWhitespace,
        ]),
        country: new FormControl("", [Validators.required]),
      }),

      creditCard: this.formBuilder.group({
        creditCardType: new FormControl("", [Validators.required]),
        nameOnCard: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopifyValidators.onlyWhitespace,
        ]),
        cardNumber: new FormControl("", [
          Validators.required,
          Validators.pattern("^4[0-9]{12}(?:[0-9]{3})?$"),
        ]),
        securityCode: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]{3,4}$"),
        ]),
        expirationMonth: new FormControl("", [Validators.required]),
        expirationYear: new FormControl("", [Validators.required]),
      }),
    });

    this.alaiahFormService.getYears().subscribe((data) => {
      this.creditCardYears = data;
    });

    const currentMonth = new Date().getMonth();
    this.alaiahFormService.getMonths(currentMonth).subscribe((data) => {
      this.creditCardMonths = data;

      console.log(JSON.stringify(data));
    });

    this.getCountries();

    this.cartService.totatPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    const authenticated = await this.isAuthenticated();

    if (authenticated) {
      const userClaims = await this.oktaAuthService.getUser();

      this.checkoutFormGroup.get("customer.email").setValue(userClaims.email);
      this.checkoutFormGroup.get("customer.email").disable();

      this.checkoutFormGroup
        .get("customer.firstName")
        .setValue(userClaims.given_name);
      this.checkoutFormGroup.get("customer.firstName").disable();

      this.checkoutFormGroup
        .get("customer.lastName")
        .setValue(userClaims.family_name);
      this.checkoutFormGroup.get("customer.lastName").disable();
    }

    /*
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        console.log(JSON.stringify(result));
        this.isAuthenticated = result;
        this.getUserDetails()
      },
      (error) => {

        console.log(JSON.stringify(error));
      });
     */

    //this.checkIfUserIsAuthenticated();
  }

  async isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!(await this.oktaAuthService.tokenManager.get("accessToken"));
  }

  async getUserDetails() {
    this.oktaAuthService.getUser().then((res) => {
      this.checkoutFormGroup.get("customer.email").setValue(res.email);
      this.checkoutFormGroup.get("customer.email").disable();

      const myArr = res.name.split(" ");
      this.checkoutFormGroup.get("customer.firstName").setValue(myArr[0]);
      this.checkoutFormGroup.get("customer.firstName").disable();

      this.checkoutFormGroup.get("customer.lastName").setValue(myArr[1]);
      this.checkoutFormGroup.get("customer.lastName").disable();
    });
  }

  checkEmail(email) {
    console.log(email);
  }

  get firstName() {
    return this.checkoutFormGroup.get("customer.firstName");
  }
  get lastName() {
    return this.checkoutFormGroup.get("customer.lastName");
  }
  get email() {
    return this.checkoutFormGroup.get("customer.email");
  }

  get shippingStreet() {
    return this.checkoutFormGroup.get("shippingAddress.street");
  }
  get shippingCity() {
    return this.checkoutFormGroup.get("shippingAddress.city");
  }
  get shippingState() {
    return this.checkoutFormGroup.get("shippingAddress.state");
  }
  get shippingZipCode() {
    return this.checkoutFormGroup.get("shippingAddress.zipCode");
  }
  get shippingCountry() {
    return this.checkoutFormGroup.get("shippingAddress.country");
  }

  get billingStreet() {
    return this.checkoutFormGroup.get("billingAddress.street");
  }
  get billingCity() {
    return this.checkoutFormGroup.get("billingAddress.city");
  }
  get billingState() {
    return this.checkoutFormGroup.get("billingAddress.state");
  }
  get billingZipCode() {
    return this.checkoutFormGroup.get("billingAddress.zipCode");
  }
  get billingCountry() {
    return this.checkoutFormGroup.get("billingAddress.country");
  }

  get creditCardType() {
    return this.checkoutFormGroup.get("creditCard.creditCardType");
  }
  get nameOnCard() {
    return this.checkoutFormGroup.get("creditCard.nameOnCard");
  }
  get cardNumber() {
    return this.checkoutFormGroup.get("creditCard.cardNumber");
  }
  get securityCode() {
    return this.checkoutFormGroup.get("creditCard.securityCode");
  }
  get expirationMonth() {
    return this.checkoutFormGroup.get("creditCard.expirationMonth");
  }
  get expirationYear() {
    return this.checkoutFormGroup.get("creditCard.expirationYear");
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    let selectedYear = creditCardFormGroup.value.expirationYear;
    const currentYear = new Date().getFullYear();
    let startMonth: number = 1;

    console.log(`Selected Year: ${selectedYear} Current Year: ${currentYear}`);

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.alaiahFormService.getMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    } else {
      this.placeOrder();
    }
  }

  placeOrder() {
    let order: Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cart;

    let orderItems: OrderItem[] = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    let purchase: Purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls["customer"].value;

    purchase.shippingAddress =
      this.checkoutFormGroup.controls["shippingAddress"].value;
    console.log(purchase.shippingAddress);
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress =
      this.checkoutFormGroup.controls["billingAddress"].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;

    purchase.orderItems = orderItems;

    this.checkoutService.savePurchaseOrder(purchase).subscribe({
      next: (response) => {
        console.log(
          `Your order has been receieved. \n Order Tracking Number: ${response.orderTrackingNumber}`
        );
        this.resetCart();
        this.router.navigateByUrl("/completed");
      },
      error: (err) => {
        alert(`${err.message}`);
      },
    });

    //this.checkoutService
  }

  resetCart() {
    this.cartService.cart = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totatPrice.next(0);

    this.checkoutFormGroup.reset();
    sessionStorage.clear();

    this.router.navigateByUrl("/products");
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      console.log("checked");
      this.billingAddressStates = this.shippingAddressStates;

      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
    } else {
      console.log("checked");
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }
  }

  getCountries() {
    this.alaiahFormService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  populateStatesForShippingAddress() {
    const shippingAddressFormGroup =
      this.checkoutFormGroup.get("shippingAddress");

    const countryCode = shippingAddressFormGroup.value.country.code;

    this.alaiahFormService.getStates(countryCode).subscribe((data) => {
      this.shippingAddressStates = data;
    });

    console.log(`Selected Country: ${countryCode}`);
  }

  populateStatesForBillingAddress() {
    const billingAddressFormGroup =
      this.checkoutFormGroup.get("billingAddress");

    const countryCode = billingAddressFormGroup.value.country.code;

    this.alaiahFormService.getStates(countryCode).subscribe((data) => {
      this.billingAddressStates = data;
    });
  }
}
