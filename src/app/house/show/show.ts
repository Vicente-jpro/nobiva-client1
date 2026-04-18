import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HouseService } from '../../service/house-service';
import { HouseResponseDetails } from '../../models/house/house-response-details';

@Component({
  selector: 'app-show',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, CurrencyPipe],
  templateUrl: './show.html',
  styleUrl: './show.scss',
})
export class Show implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  service = inject(HouseService);
  house = new HouseResponseDetails();
  houseId = '';

  ngOnInit(): void {
    this.houseId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.houseId) {
      this.service.findById(this.houseId).subscribe({
        next: (houseResponse) => {
          this.house = houseResponse;
          console.log('House details:', houseResponse);
        },
        error: (err) => {
          console.error('Error loading house details:', err);
        }
      });
    }
  }

  onEdit(): void {
    this.router.navigate(['/menu/casas/editar', this.houseId]);
  }
}
