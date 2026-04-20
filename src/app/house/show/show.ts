import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../service/house-service';
import { HouseResponseDetails } from '../../models/house/house-response-details';
import { Image } from '../../models/image';
import { FavoriteHouseService } from '../../service/favorite-house-service';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';

@Component({
  selector: 'app-show',
  imports: [Success, Danger],
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
        this.changeDetection.markForCheck();
      },
      error: (errorResponse) => {
        this.display.success = '';
        this.display.errors = errorResponse.error.errors;
        this.changeDetection.markForCheck();
      }
    });
  }

  onDelete(idHouse: string): void {
    this.service.delete(idHouse).subscribe({
      next: (response) => {
        this.display.success = response.message;
        this.display.errors = [];
        this.changeDetection.markForCheck();
        setTimeout(() => this.router.navigate(['/menu/casas']), 3000);
      },
      error: (err) => {
        this.display.success = '';
        this.display.errors = err.error.errors;
        this.changeDetection.markForCheck();
        setTimeout(() => this.router.navigate(['/menu/casas']), 3000);
      }
    });
  }
}
