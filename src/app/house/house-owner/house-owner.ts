import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { HouseService } from '../../service/house-service';
import { HousePartial } from '../house-partial/house-partial';
import { HouseResponse } from '../../models/house/house-response';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-house-owner',
  imports: [HousePartial],
  templateUrl: './house-owner.html',
  styleUrl: './house-owner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseOwner implements OnInit {

  myhouses = signal<HouseResponse[]>([]);
  myPage = 0;

  private service = inject(HouseService);
  private changeDetection = inject(ChangeDetectorRef);
  protected user = inject(AuthService);

  ngOnInit(): void {
    this.findAllByOwner(this.myPage);
  }

  goToNextMyPage(): void {
    this.myPage++;
    this.findAllByOwner(this.myPage);
  }

  findAllByOwner(pageNumber: number): void {
    if (this.user.isLoggedIn()) {
      this.service.findAllByOwner(pageNumber).subscribe({
        next: (response) => {
          this.myhouses.update(current => [...current, ...response]);
          this.changeDetection.markForCheck();
        },
        error: (err) => {
          this.changeDetection.markForCheck();
        }
      });
    }
  }

}
