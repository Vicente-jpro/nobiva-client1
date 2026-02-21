import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home),
        //canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./user/login/login').then(m => m.Login)
    },
    {
        path: 'signup',
        loadComponent: () => import('./user/signup/signup').then(m => m.Signup)
    }

];
