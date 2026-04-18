import { ChangeDetectionStrategy, Component, inject, Input, computed, signal, Output, EventEmitter, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { HouseFormBuilder } from './house-form-builder';
import {MatRadioModule} from '@angular/material/radio';
import { AuthService } from '../../service/auth.service';
import { Address } from '../../service/address';
import { MatSelectModule } from '@angular/material/select';
import { HouseCreateRequest } from '../../models/house/house-create-request';
import { MatIconModule } from '@angular/material/icon';
import { UploadFile } from '../../upload-file/upload-file';
import { HouseAndImage } from '../../models/house/house-and-image';
import { HouseResponseDetails } from '../../models/house/house-response-details';

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
    MatIconModule
],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
})
export class Form extends HouseFormBuilder implements OnInit {

    protected authService = inject(AuthService);
    protected addressService = inject(Address);
    private houseModel = new HouseCreateRequest();
    protected selectedFiles!: FileList;
    protected imagesUploaded!: FormData;
    
    @Input() title: string = '';
    @Input() houseData: HouseResponseDetails | null = null;

    @Output() formEvent = new EventEmitter<HouseAndImage>();


  onSubmit(){
    let houseAndImages = new HouseAndImage();
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
    
    houseAndImages.house = this.houseModel;
    houseAndImages.imageFormData = this.imagesUploaded;
    console.log('HouseAndImages on submit:', houseAndImages);
     
    this.formEvent.emit(houseAndImages);
    
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles) {
      const uploadFile = new UploadFile();
      this.imagesUploaded = uploadFile.onUpload(this.selectedFiles);
      console.log('FormData with selected files:', this.imagesUploaded.getAll('images'));
    }
  }
  
  ngOnInit(): void {
  if (this.houseData) {
    this.houseForm.patchValue({
      title: this.houseData.title,
      description: this.houseData.description,
      avaliable: this.houseData.avaliable,
      number_of_rooms: this.houseData.number_of_rooms,
      tipology: this.houseData.tipology,
      status_post: this.houseData.status_post,
      status_condition: this.houseData.status_condition,
      type_negotiation: this.houseData.type_negotiation,
      furnished: this.houseData.furnished,
      swimming_pool: this.houseData.swimming_pool,
      kitchen: this.houseData.kitchen,
      backyard: this.houseData.backyard,
      bathroom: this.houseData.bathroom,
      price: this.houseData.price,
      post_address: {
        address: {
          street1: this.houseData.post_address?.address?.street1,
          street2: this.houseData.post_address?.address?.street2,
          zipeCode: this.houseData.post_address?.address?.zipeCode,
        },
        locality: {
          id: this.houseData.post_address?.locality?.id
        }
      }
    });
  }
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