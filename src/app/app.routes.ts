import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home)
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
