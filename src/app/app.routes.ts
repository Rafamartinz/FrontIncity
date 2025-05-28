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
import { ShowDeviceComponent } from './front-page/pages/ShowDevice/ShowDevice.component';
import { CreateZonesComponent } from './front-page/pages/CreateZones/CreateZones.component';
import { ZoneToDeviceComponent } from './front-page/pages/ZoneToDevice/ZoneToDevice.component';
import { ModifyDeviceComponent } from './front-page/pages/ModifyDevice/ModifyDevice.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canActivate: [NotAuthenticatedGuard], // Solo si NO esta autenticado
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthenticatedGuard], // Solo si esta autenticado
  },
  {
    path: 'ListDevice',
    component: ListDeviceComponent,
    canActivate: [AuthenticatedGuard], // Solo si esta autenticado
  },
  {
    path: 'create',
    component: CreateDevicesComponent,
    canActivate: [AuthenticatedGuard], // Solo si esta autenticado
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthenticatedGuard], // Solo si esta autenticado
  },
  {
    path: 'dispositivo/:id',
    component: ShowDeviceComponent,
    canActivate: [AuthenticatedGuard], // Solo si esta autenticado
  },
  {
    path: 'zonas',
    component: CreateZonesComponent,
    canActivate: [AuthenticatedGuard], // Solo si esta autenticado
  },
  {
    path: 'AddzoneAdvice',
    component: ZoneToDeviceComponent,
    canActivate: [AuthenticatedGuard], // Solo si esta autenticado
  },
  {
    path: 'modify/:id',
    component: ModifyDeviceComponent,
    canActivate: [AuthenticatedGuard], // Solo si esta autenticado
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
