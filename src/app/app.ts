import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import { Footer } from "./footer/footer";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { User } from './user/user';
import { AuthService } from './user/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
   imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    RouterOutlet,
    Footer,
    MatProgressBarModule,
    RouterLinkWithHref
],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
   
})
export class App {
  protected readonly title = signal('Nobiva');
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/user/login']);
  }
    
}
