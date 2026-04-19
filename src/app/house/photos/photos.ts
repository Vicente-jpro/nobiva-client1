import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Image } from '../../models/image';

@Component({
  selector: 'app-photos',
  imports: [],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos implements OnInit {
  private router = inject(Router);
  private location = inject(Location);

  images: Image[] = [];

  ngOnInit(): void {
    const state = this.router.lastSuccessfulNavigation()?.extras?.state;
    if (state && state['images']) {
      this.images = state['images'];
    }
  }

  onBack(): void {
    this.location.back();
  }
}
