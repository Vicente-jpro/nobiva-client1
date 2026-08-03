import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Province } from '../models/address/province';
import { Observable } from 'rxjs';
import { Country } from '../models/address/country';
import { Locality } from '../models/address/locality';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  findCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.apiUrl}/paises`);
  }

  findProvincesByCountryId(countryId: number): Observable<Province[]> {
    return this.httpClient.get<Province[]>(`${this.apiUrl}/paises/${countryId}/provincias`);
  }


  findLocalitiesByProvinceId(provinceId: number): Observable<Locality[]> {
    return this.httpClient.get<Locality[]>(`${this.apiUrl}/provincias/${provinceId}/localidades`);
  }

  findProvinces(): Observable<Province[]> {
    return this.httpClient.get<Province[]>(`${this.apiUrl}/provincias`);
  }

}
