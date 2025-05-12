import { Routes } from '@angular/router';

import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { EnviromentalPageComponent } from './environmentals/pages/enviromental-page/enviromental-page.component';
import { MenuComponent } from './Menu/Menu.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: 'environmental',
    component: EnviromentalPageComponent,
    title: 'Environmental',
  },

  {
    path: '**',
    redirectTo: '',
  },
];
