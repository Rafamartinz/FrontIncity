import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../app.routes';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  router = inject(Router);
  routes = routes
    .map((route) => ({
      path: route.path,
      title: route.title,
    }))
    .filter((route) => route.path != '**');
}
