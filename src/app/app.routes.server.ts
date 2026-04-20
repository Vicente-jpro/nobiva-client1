import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'user/signup/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'menu/casas/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'menu/casas/:id/editar',
    renderMode: RenderMode.Server
  },
  {
    path: 'menu/casas/:id/fotos',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
