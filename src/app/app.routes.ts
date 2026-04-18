import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'server-down',
        loadComponent: () => import('./server-down/server-down').then(m => m.ServerDown)
    },
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
                children: [
                    {
                        path: 'new',
                        loadComponent: () => import('./user/signup/new/new').then(m => m.New)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./user/signup/edit/edit').then(m => m.Edit)
                    }
                ]
                
            },
            {
                path: 'change-password',
                loadComponent: () => import('./user/change-password/change-password').then(m => m.ChangePassword)
            },
            {
                path: 'confirme-account',
                loadComponent: () => import('./user/confirme-account/confirme-account').then(m => m.ConfirmeAccount)
            }

        ]
    },

    {
        path: 'menu',
        loadComponent: () => import('./menu-property/menu-property').then(m => m.MenuProperty),
        children: [
            {
                path: 'casas',
                children: [
                   {
                        path: '',
                        loadComponent: () => import('./house/house').then(m => m.House)
                    },
                    {
                        path: 'nova',
                        loadComponent: () => import('./house/new/new').then(m => m.New)
                    },
                    {
                        path: ':id',
                        loadComponent: () => import('./house/show/show').then(m => m.Show)
                    }
                    /*{
                        path: 'favoritas',
                        loadComponent: () => import('./house/favorites/favorites').then(m => m.Favorites)
                    },
                    {
                        path: 'minhas',
                        loadComponent: () => import('./house/my-houses/my-houses').then(m => m.MyHouses)
                    }*/
                ]    


            }
        ]
    },


];
