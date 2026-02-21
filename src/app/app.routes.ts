import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home),
        //canActivate: [authGuard]
    },
    {
        path: 'user',
        children: [
            {
                path: 'password-recover',
                loadComponent: () => import('./user/password-recover/password-recover').then(m => m.PasswordRecover)
            },

            {
                path: 'login',
                loadComponent: () => import('./user/login/login').then(m => m.Login)
            },
            {
                path: 'signup',
                loadComponent: () => import('./user/signup/signup').then(m => m.Signup)
            },
            {
                path: 'change-password',
                loadComponent: () => import('./user/change-password/change-password').then(m => m.ChangePassword)
            }

        ]
    },




];
