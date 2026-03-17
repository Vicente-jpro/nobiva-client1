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
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { AuthService } from '../../service/auth.service';
import { Address } from '../../service/address';


export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

interface Food {
  value: string;
  viewValue: string;
}

interface ProvinceOption {
  value: number;
  viewValue: string;
}

interface CountryOption {
  value: string;
  viewValue: string;
}

interface LocalityOption {
  value: string;
  viewValue: string;
}

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
     addressService = inject(Address);
    protected role = UserRole;
    protected selectedCountry: any = null;

    @Input() title: string = '';

    @Output() formEvent = new EventEmitter<UserSignup>();

    provinceOptions: ProvinceOption[] = [];
    countryOptions: CountryOption[] = [];
    localityOptions: LocalityOption[] = [];

    foods: Food[] = [
      {value: 'steak-0', viewValue: 'Steak'},
      {value: 'pizza-1', viewValue: 'Pizza'},
      {value: 'tacos-2', viewValue: 'Tacos'},
    ];

    readonly task = signal<Task>({
    name: 'Roles task',
    completed: false,
    subtasks: [
      {name: 'Administrador', completed: false},
      {name: 'Proprietário', completed: false},
      {name: 'Inclino', completed: false},
    ],
  });


  onSubmit(){
    console.log(this.houseForm.value);

  }

  ngOnInit(): void {
  this.addressService.findCountries()
    .subscribe({
      next: countries => {
  
        this.countryOptions = countries.map(country => ({
          value: country.id.toString(),
          viewValue: country.name
        }));
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      }
    });

  }

  onCountryChange(countryId: number) {
    this.selectedCountry = countryId;
    console.log('Selected country:', this.selectedCountry);

    this.addressService.findProvincesByCountry(countryId)
      .subscribe({
        next: provinces => {
          console.log('Fetched provinces:', provinces);
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

  onProvinceChange(provinceId: any) {
    console.log('Selected province:', provinceId);
    this.localityOptions = [];
    this.houseForm.get('post_address.locality.id')?.reset();
    this.addressService.findLocalities(parseInt(provinceId))
      .subscribe({
        next: localities => {
          this.localityOptions = localities.map(locality => ({
            value: locality.id.toString(),
            viewValue: locality.locality
          }));
        },
        error: (err) => {
          console.error('Error fetching localities:', err);
        }
      });
  }

  onLocalityChange(localityId: any) {
    console.log('Selected locality:', localityId);
  }

}