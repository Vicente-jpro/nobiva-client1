import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HouseService } from '../../service/house-service';
import { HouseResponseDetails } from '../../models/house/house-response-details';
import { Image } from '../../models/image';
import { FavoriteHouseService } from '../../service/favorite-house-service';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';

@Component({
  selector: 'app-show',
  imports: [
    MatButtonModule, 
    MatDividerModule, 
    MatIconModule,
    Success,
    Danger,
  ],
  templateUrl: './show.html',
  styleUrl: './show.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Show implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  service = inject(HouseService);
  house = new HouseResponseDetails();
  favoriteService = inject(FavoriteHouseService);

  changeDetection = inject(ChangeDetectorRef);
  display = new DisplayMessage();

  houseId = '';
  ngOnInit(): void {
    this.houseId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.houseId) {
      this.service.findById(this.houseId).subscribe({
        next: (houseResponse) => {
          this.house = houseResponse;
          console.log('House details:', this.house);
          this.changeDetection.markForCheck();
        },
        error: (err) => {
          console.error('Error loading house details:', err.error);
        }
      });
    }
  }

  onEdit(): void {
    this.router.navigate(['/menu/casas/', this.houseId, 'editar']);
  }

  onShowPhotos(images: Image[]): void {
    this.router.navigate(['/menu/casas', this.houseId, 'fotos'], {
      state: { images }
    });
  }

  saveFavorite(idHouse: string): void {
    this.favoriteService.save(idHouse).subscribe({
      next: (response) => {
        this.display.success = response.message;
        this.display.errors = [];
        console.log('Favorite saved successfully:', response);
        this.changeDetection.markForCheck();
      },
      error: (errorResponse) => {
        this.display.success = '';
        this.display.errors = errorResponse.error.errors;
        console.error('Error saving favorite:', errorResponse.error.errors);
        this.changeDetection.markForCheck();
      }
    });
  }


}
