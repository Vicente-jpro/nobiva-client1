import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Province } from '../models/address/province';
import { Observable } from 'rxjs';
import { Country } from '../models/address/country';
import { Locality } from '../models/address/locality';

@Injectable({
  providedIn: 'root',
})
export class Address {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api'; // URL da API para usuários

  findCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.apiUrl}/paises`);
  }

  findProvincesByCountryId(countryId: number): Observable<Province[]> {
    return this.httpClient.get<Province[]>(`${this.apiUrl}/paises/${countryId}/provincias`);
  }


  findLocalitiesByProvinceId(provinceId: number): Observable<Locality[]> {
    return this.httpClient.get<Locality[]>(`${this.apiUrl}/provincias/${provinceId}/localidades`);
  }

}
