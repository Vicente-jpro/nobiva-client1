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
  value: string;
  viewValue: string;
}

interface CountryOption {
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
    private addressService = inject(Address);
    protected role = UserRole;
    protected selectedValue = input<any>('');

    @Input() title: string = '';

    @Output() formEvent = new EventEmitter<UserSignup>();

    provinceOptions: ProvinceOption[] = []; 
    countryOptions: CountryOption[] = [];

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
    console.log(this.selectedValue);
    console.log(this.houseForm.value);

    console.log("Selected value",this.selectedValue);
  }

  ngOnInit(): void {
  this.addressService.findCountries()
    .subscribe({
      next: countries => {
        console.log('Countries:', countries);
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

  findProvinces(event: MatSelectChange) {
    const selectedCountryId = event.value;
    console.log('Selected country ID:', selectedCountryId);

    this.addressService.findProvinces(parseInt(selectedCountryId))
      .subscribe({
        next: provinces => {
          console.log('Provinces:', provinces);
          this.provinceOptions = provinces.map(province => ({
            value: province.id.toString(),
            viewValue: province.name
          }));
        },
        error: (err) => {
          console.error('Error fetching provinces:', err);
        }
      });
  }



}