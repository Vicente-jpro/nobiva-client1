import { ChangeDetectionStrategy, Component, inject, Input, computed, signal, Output, EventEmitter, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { RouterLink } from "@angular/router";
import { UserRole } from '../../models/user/userRole';
import { UserSignup } from '../../models/user/userSignup';
import { HouseFormBuilder } from './house-form-builder';
import {MatRadioModule} from '@angular/material/radio';
import { AuthService } from '../../service/auth.service';
import { Address } from '../../service/address';
import { StatusPost } from '../../models/property-status';
import { Tipology } from '../../models/property-tipology';
import { MatSelectModule } from '@angular/material/select';
import { TypeNegotiation } from '../../models/negotiation-type';
import { StatusCondition } from '../../models/property-condition';


export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

interface baseValueNumberOption {
  value: number;
  viewValue: string;
}

interface baseValueStringOption {
  value: string;
  viewValue: string;
}

interface ProvinceOption extends baseValueNumberOption { }

interface CountryOption extends baseValueNumberOption { }

interface LocalityOption extends baseValueNumberOption { }

interface StatusPostOption extends baseValueStringOption { }

interface TypeNegotiationOption extends baseValueStringOption { }

interface StatusPostOption extends baseValueStringOption { }

interface TypeNegotiationOption extends baseValueStringOption { }

interface TypeNegotiationOption extends baseValueStringOption { }

interface TipologyOption extends baseValueStringOption { }

interface StatusConditionOption extends baseValueStringOption { }

@Component({
  selector: 'app-form',
    imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatListModule,
    RouterLink,
    MatRadioModule,
    MatSelectModule,
],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form extends HouseFormBuilder implements OnInit {

    protected authService = inject(AuthService);
    protected addressService = inject(Address);

    @Input() title: string = '';

    @Output() formEvent = new EventEmitter<UserSignup>();

    provinceOptions: ProvinceOption[] = [];
    countryOptions: CountryOption[] = [];
    localityOptions: LocalityOption[] = [];

    statusPostOptions: StatusPostOption[] = [
        { value: StatusPost.APROVADO, viewValue: StatusPost.APROVADO },
        { value: StatusPost.PENDENTE, viewValue: StatusPost.PENDENTE },
        { value: StatusPost.BLOQUEADO, viewValue: StatusPost.BLOQUEADO },
        { value: StatusPost.REPROVADO, viewValue: StatusPost.REPROVADO },
    ];

    typeNegotiationOptions: TypeNegotiationOption[] = [
        { value: TypeNegotiation.ARRENDAMENTO, viewValue: TypeNegotiation.ARRENDAMENTO },
        { value: TypeNegotiation.VENDA, viewValue: TypeNegotiation.VENDA },


    ];
    tipologyOptions: TipologyOption[] = [
        { value: Tipology.T1, viewValue: Tipology.T1 },
        { value: Tipology.T2, viewValue: Tipology.T2 },
        { value: Tipology.T3, viewValue: Tipology.T3 },
        { value: Tipology.T4, viewValue: Tipology.T4 },
        { value: Tipology.T5, viewValue: Tipology.T5 },
        { value: Tipology.T6, viewValue: Tipology.T6 },
        { value: Tipology.T7, viewValue: Tipology.T7 },
        { value: Tipology.T8, viewValue: Tipology.T8 },
        { value: Tipology.T9, viewValue: Tipology.T9 },
        { value: Tipology.Tn, viewValue: Tipology.Tn },
    ];

    statusConditionOptions: StatusConditionOption[] = [
        { value: StatusCondition.NOVO, viewValue: StatusCondition.NOVO },
        { value: StatusCondition.USADO, viewValue: StatusCondition.USADO },
    ];

  onSubmit(){
    console.log(this.houseForm.value);
  }

  ngOnInit(): void {
  this.addressService.findCountries()
    .subscribe({
      next: countries => {
  
        this.countryOptions = countries.map(country => ({
          value: country.id,
          viewValue: country.name
        }));
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      }
    });

  }

  onCountryChange(countryId: number) {

    this.addressService.findProvincesByCountryId(countryId)
      .subscribe({
        next: provinces => {
        
          this.provinceOptions = provinces.map(province => ({
            value: province.id,
            viewValue: province.name
          }));
        },
        error: (err) => {
          console.error('Error fetching provinces:', err);
        }
      });
  }

  onProvinceChange(provinceId: number) {

    this.localityOptions = [];
    this.houseForm.get('post_address.locality.id')?.reset();

    this.addressService.findLocalitiesByProvinceId(provinceId)
      .subscribe({
        next: localities => {
          this.localityOptions = localities.map(locality => ({
            value: locality.id,
            viewValue: locality.locality
          }));
        },
        error: (err) => {
          console.error('Error fetching localities:', err);
        }
      });
  }

}