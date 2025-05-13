import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  router = inject(Router);
  authservice = inject(AuthService);
  routes = [
    { path: '/create', title: 'Creador de dispositivos' },
    { path: '/ListDevice', title: 'Lista de dispositivos' },
  ];
  logout() {
    this.authservice.logout();
  }
}
