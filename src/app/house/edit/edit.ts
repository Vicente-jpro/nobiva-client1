import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from '../form/form';
import { HouseService } from '../../service/house-service';
import { HouseResponseDetails } from '../../models/house/house-response-details';
import { HouseAndImage } from '../../models/house/house-and-image';
import { HouseCreateRequest } from '../../models/house/house-create-request';
import { HouseFormBuilder } from '../form/house-form-builder';
import { DisplayMessage } from '../../models/display-message';

@Component({
  selector: 'app-edit',
  imports: [Form],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit extends HouseFormBuilder implements OnInit {
  titleData = 'Editar Casa';
  houseId = '';
  houseData: HouseResponseDetails | null = null;
  display = new DisplayMessage();

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(HouseService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.houseId = this.route.snapshot.paramMap.get('id') ?? '';

    this.service.findById(this.houseId).subscribe({
      next: (house) => {
        this.houseData = house;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors  };
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(houseAndImages: HouseAndImage): void {
    const houseRequest = houseAndImages.house as HouseCreateRequest;

    this.service.update(this.houseId, houseRequest).subscribe({
      next: (_response) => {
        this.display = { success: 'A casa foi atualizada com sucesso.', errors: [] };
        if (houseAndImages.imageFormData) {
          this.uploadImages(this.houseId, houseAndImages.imageFormData);
        } else {
          this.router.navigate(['/menu/casas', this.houseId]);
        }
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors };
        this.cdr.markForCheck();
      }
    });
  }

  private uploadImages(idHouse: string, imagesFormData: FormData): void {
    this.service.uploadImages(idHouse, imagesFormData).subscribe({
      next: () => {
        this.router.navigate(['/menu/casas', this.houseId]);
      },
      error: (err) => {
        this.display = { success: '', errors: err.error?.errors || ['Ocorreu um erro ao enviar as imagens.'] };
        this.cdr.markForCheck();
      }
    });
  }
}
