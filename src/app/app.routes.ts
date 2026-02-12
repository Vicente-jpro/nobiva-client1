import { Routes } from '@angular/router';

export const routes: Routes = [
    {  
        path: 'navigation', 
        loadComponent: () => import('./navigation/navigation.component').then(m => m.NavigationComponent) }
];
