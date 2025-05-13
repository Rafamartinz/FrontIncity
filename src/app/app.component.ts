import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgIf } from '@angular/common';
import { AuthService } from './auth/service/auth.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  Authservice = inject(AuthService);
}
