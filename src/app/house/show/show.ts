import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../service/house-service';
import { HouseResponseDetails } from '../../models/house/house-response-details';
import { Image } from '../../models/image';
import { FavoriteHouseService } from '../../service/favorite-house-service';
import { DisplayMessage } from '../../models/display-message';
import { Success } from '../../alerts/success/success';
import { Danger } from '../../alerts/danger/danger';
import { AuthService } from '../../service/auth.service';
import { PropertyContactForm } from '../../shared/components/property-contact-form/property-contact-form';
import { parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-show',
  imports: [Success, Danger, PropertyContactForm],
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
  protected readonly authService = inject(AuthService);

  changeDetection = inject(ChangeDetectorRef);
  display = new DisplayMessage();

  houseId = '';
  protected telephoneCopied = false;
  protected telephoneCopyFailed = false;

  protected get ownerName(): string {
    return this.house.username || this.house.user?.username || '';
  }

  protected get ownerEmail(): string {
    return this.house.email || this.house.user?.email || '';
  }

  protected get ownerTelephone(): string {
    return this.house.telephone || '';
  }

  protected get formattedOwnerTelephone(): string {
    return this.parsedOwnerTelephone?.formatInternational() || this.ownerTelephone.trim();
  }

  protected get ownerWhatsAppUrl(): string {
    const telephone = this.parsedOwnerTelephone?.number;
    return telephone ? `https://wa.me/${telephone.slice(1)}` : '';
  }

  protected async copyOwnerTelephone(): Promise<void> {
    const telephone = this.parsedOwnerTelephone?.number || this.ownerTelephone.trim();
    if (!telephone || !globalThis.navigator?.clipboard) {
      this.showCopyResult(false);
      return;
    }

    try {
      await globalThis.navigator.clipboard.writeText(telephone);
      this.showCopyResult(true);
    } catch {
      this.showCopyResult(false);
    }
  }

  private get parsedOwnerTelephone(): PhoneNumber | undefined {
    const value = this.ownerTelephone.trim();
    if (!value) return undefined;
    const telephone = parsePhoneNumberFromString(value);
    return telephone?.isValid() ? telephone : undefined;
  }

  private showCopyResult(success: boolean): void {
    this.telephoneCopied = success;
    this.telephoneCopyFailed = !success;
    this.changeDetection.markForCheck();
    globalThis.setTimeout(() => {
      this.telephoneCopied = false;
      this.telephoneCopyFailed = false;
      this.changeDetection.markForCheck();
    }, 2500);
  }

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
    if (!this.authService.isLoggedIn()) {
      this.display = {
        success: '',
        errors: ['Inicie sessão para guardar favoritos.'],
      };
      this.changeDetection.markForCheck();
      return;
    }

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
