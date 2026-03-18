import { ChangeDetectionStrategy, Component, inject, Input, computed, signal, Output, EventEmitter, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { UserSignup } from '../../models/user/userSignup';
import { HouseFormBuilder } from './house-form-builder';
import {MatRadioModule} from '@angular/material/radio';
import { AuthService } from '../../service/auth.service';
import { Address } from '../../service/address';
import { MatSelectModule } from '@angular/material/select';
import { HouseCreateRequest } from '../../models/house/house-create-request';
import { HouseService } from '../../service/house-service';
import { DialogMessageData } from '../../dialog-message/dialog-message-data';

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
    private houseModel = new HouseCreateRequest();
    private service = inject(HouseService);
    private dialog = new DialogMessageData();
    
    @Input() title: string = '';

    @Output() formEvent = new EventEmitter<UserSignup>();


  onSubmit(){
    const formValue = this.houseForm.value;

    this.houseModel = {
      ...formValue,
      post_address: {
        ...formValue.post_address,
        locality: {
          id: formValue.post_address?.locality?.id
        }
      }
    } as HouseCreateRequest;

    
    this.service.save(this.houseModel).subscribe({
      next: (response) => {
        this.dialog.content = 'A casa foi salva com sucesso.';
        this.dialog.openDialog();
        console.log('House saved successfully:', response); 
      },
      error: (err) => {
        this.dialog.content = err.error?.message || 'Ocorreu um erro ao salvar a casa.';
        this.dialog.openDialog();
        console.error('Error saving house:', err);
      }
    });

    
  }

  ngOnInit(): void {
  
  this.dialog.title = 'Casa';

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