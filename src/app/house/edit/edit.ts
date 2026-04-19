import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from '../form/form';
import { HouseService } from '../../service/house-service';
import { HouseResponseDetails } from '../../models/house/house-response-details';
import { HouseAndImage } from '../../models/house/house-and-image';
import { HouseCreateRequest } from '../../models/house/house-create-request';
import { DialogMessageData } from '../../dialog-message/dialog-message-data';

@Component({
  selector: 'app-edit',
  imports: [Form],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit implements OnInit {
  titleData = 'Editar Casa';
  houseId = '';
  houseData: HouseResponseDetails | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(HouseService);
  private dialog = new DialogMessageData();

  ngOnInit(): void {
    this.houseId = this.route.snapshot.paramMap.get('id') ?? '';
    this.dialog.title = 'Casa';

    this.service.findById(this.houseId).subscribe({
      next: (house) => {
        this.houseData = house;
      },
      error: (err) => {
        console.error('Error loading house:', err);
      }
    });
  }

  onSubmit(houseAndImages: HouseAndImage): void {
    const houseRequest = houseAndImages.house as HouseCreateRequest;

    this.service.update(this.houseId, houseRequest).subscribe({
      next: (response) => {
        this.dialog.content = 'A casa foi atualizada com sucesso.';
        if (houseAndImages.imageFormData) {
          this.uploadImages(response.id, houseAndImages.imageFormData);
        }
        this.dialog.openDialog();
        this.router.navigate(['/menu/casas', this.houseId]);
      },
      error: (err) => {
        this.dialog.content = err.error?.message || 'Ocorreu um erro ao atualizar a casa.';
        this.dialog.openDialog();
        console.error('Error updating house:', err);
      }
    });
  }

  private uploadImages(idHouse: string, imagesFormData: FormData): void {
    this.service.uploadImages(idHouse, imagesFormData).subscribe({
      next: () => {
        console.log('Images uploaded successfully');
      },
      error: (err) => {
        console.error('Error uploading images:', err);
      }
    });
  }
}
