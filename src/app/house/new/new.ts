import { Component, inject, OnInit } from '@angular/core';
import { Form } from '../form/form';
import { HouseService } from '../../service/house-service';
import { DialogMessageData } from '../../dialog-message/dialog-message-data';
import { HouseAndImage } from '../../models/house/house-and-image';


@Component({
  selector: 'app-new',
  imports: [Form],
  templateUrl: './new.html',
  styleUrl: './new.scss',
})
export class New implements OnInit {
  titleData: string = 'Nova Casa';

  private service = inject(HouseService);
  private dialog = new DialogMessageData();

  ngOnInit(): void {
      this.dialog.title = 'Casa';
  }

  onSubmit(houseAndImages: HouseAndImage) {
      this.service.save(houseAndImages.house!).subscribe({
      next: (response) => {
        this.dialog.content = 'A casa foi salva com sucesso.';
        this.uploadImages(response.id, houseAndImages.imageFormData!);
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


  private uploadImages(idHouse: string, imagesFormData: FormData) {
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
