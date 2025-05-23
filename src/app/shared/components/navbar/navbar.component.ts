import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/service/auth.service';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'navbar',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  name = input.required;
  router = inject(Router);
  authservice = inject(AuthService);
  //Las opciones que tiene el desplegable del navbar
  routes = [
    { path: '/create', title: 'Creador de dispositivos' },
    { path: '/zonas', title: 'Creador de Zonas' },
    { path: '/ListDevice', title: 'Lista de dispositivos' },
    { path: '/dashboard', title: 'Dashboards' },
  ];
  logout() {
    this.authservice.logout();
  }
}
