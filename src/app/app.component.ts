import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { NgIf } from '@angular/common';
import { AuthService } from './auth/service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  Authservice = inject(AuthService);
}
