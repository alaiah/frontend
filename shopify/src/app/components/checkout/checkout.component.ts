import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Event } from '@angular/router';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { AlaiahFormService } from 'src/app/services/alaiah-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private alaiahFormService: AlaiahFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")])

      }),
      shippingAddress: this.formBuilder.group({
        address1: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      }),
      billingAddress: this.formBuilder.group({
        address1: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    this.alaiahFormService.getYears().subscribe(
      data => {
        this.creditCardYears = data;
      })

    const currentMonth = new Date().getMonth();
    this.alaiahFormService.getMonths(currentMonth).subscribe(
      data => {
        this.creditCardMonths = data;

        console.log(JSON.stringify(data));
      }
    );

    this.getCountries()
  }


  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  handleMonthsAndYears() {

    console.log("Hello");

    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");


    let selectedYear = creditCardFormGroup.value.expirationYear;
    const currentYear = new Date().getFullYear();
    let startMonth: number = 1;

    console.log(`Selected Year: ${selectedYear} Current Year: ${currentYear}`)

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.alaiahFormService.getMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }


  onSubmit() {

  }



  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      console.log("checked");
      this.billingAddressStates = this.shippingAddressStates;

      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

    } else {
      console.log("checked");
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }
  }

  getCountries() {

    this.alaiahFormService.getCountries().subscribe(
      data => {
        this.countries = data;
       }
    );
  }

  populateStatesForShippingAddress() {

    const shippingAddressFormGroup = this.checkoutFormGroup.get('shippingAddress');

    const countryCode = shippingAddressFormGroup.get("country").value;

    this.alaiahFormService.getStates(countryCode).subscribe(
      data => { 
        this.shippingAddressStates = data;
      }
    );

    console.log(`Selected Country: ${countryCode}`)

  }


  populateStatesForBillingAddress() {

    const billingAddressFormGroup = this.checkoutFormGroup.get('billingAddress');

    const countryCode = billingAddressFormGroup.get("country").value;

    this.alaiahFormService.getStates(countryCode).subscribe(
      data => { 
        this.billingAddressStates = data;
      }
    );

    console.log(`Selected Country: ${countryCode}`)

  }
 

}
