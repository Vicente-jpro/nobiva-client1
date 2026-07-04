import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Form } from '../form/form';
import { HouseService } from '../../service/house-service';
import { HouseAndImage } from '../../models/house/house-and-image';
import { DisplayMessage } from '../../models/display-message';


@Component({
  selector: 'app-new',
  imports: [Form],
  templateUrl: './new.html',
  styleUrl: './new.scss',
})
export class New implements OnInit {
  titleData: string = 'Nova Casa';

  private service = inject(HouseService);
  display = new DisplayMessage();
  private cdr = inject(ChangeDetectorRef);
  ngOnInit(): void {}

  onSubmit(houseAndImages: HouseAndImage) {
    this.service.save(houseAndImages.house!).subscribe({
      next: (response) => {
        this.display = { success: 'A casa foi salva com sucesso.', errors: [] };
        if (houseAndImages.imageFormData) {
          this.uploadImages(response.id, houseAndImages.imageFormData);
        }
        this.cdr.markForCheck();
        console.log('House saved successfully:', response);
      },
      error: (err) => {
        this.display = { success: '', errors: err.error.errors || ['Ocorreu um erro ao salvar a casa.'] };
        this.cdr.markForCheck();
      }
    });
  }


  private uploadImages(idHouse: string, imagesFormData: FormData) {
    this.service.uploadImages(idHouse, imagesFormData).subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.display = { success: '', errors: err.error?.errors || ['Ocorreu um erro ao enviar as imagens.'] };
        this.cdr.markForCheck();
      }
    });
  }

}
