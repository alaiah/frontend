import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs'
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlaiahFormService {

  

   baseUrl: string = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  getYears(): Observable<number[]> {

    let years: number[] = [];
    let startYear = new Date().getFullYear();
    let endYear = startYear + 10;

      for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }

    return of(years);
  }


  getMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];
    for (let i = startMonth; i <= 12; i++) {
      data.push(i);
    }

    console.log(JSON.stringify(data));
    return of(data);

  }

  getCountries(): Observable<Country[]> {

    const countryUrl = `${this.baseUrl}/countries`
    return this.httpClient.get<GetCountries>(countryUrl).pipe(
      map(response => response._embedded.countries)
    );
    
  }

  getStates(code: string): Observable<State[]> {
    const stateUrl = `${this.baseUrl}/states/search/findByCountryCode?code=${code}`;

    return this.httpClient.get<GetStates>(stateUrl).pipe(
      map(response => response._embedded.states)
    );

  }

}



 interface GetCountries {

    _embedded: {
      countries: Country[];

    }

}

interface GetStates {

  _embedded: {

    states: State[];
  }
}