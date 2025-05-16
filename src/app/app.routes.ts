// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { MenuComponent } from './front-page/pages/Menu/Menu.component';
import { CreateDevicesComponent } from './front-page/pages/CreateDevices/CreateDevices.component';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './auth/pages/register-page/register-page.component';
import { ListDeviceComponent } from './front-page/pages/ListDevice/ListDevice.component';
import { DashboardPageComponent } from './front-page/pages/dashboard.page/dashboard.page.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canActivate: [NotAuthenticatedGuard], // Solo si NO está autenticado
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthenticatedGuard], // Solo si está autenticado
  },
  {
    path: 'ListDevice',
    component: ListDeviceComponent,
    canActivate: [AuthenticatedGuard], // Solo si está autenticado
  },
  {
    path: 'create',
    component: CreateDevicesComponent,
    canActivate: [AuthenticatedGuard], // Solo si está autenticado
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthenticatedGuard], // Solo si está autenticado
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
