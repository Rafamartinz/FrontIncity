// src/app/auth/guards/not-authenticated.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotAuthenticatedGuard implements CanActivate {
  constructor(private AuthService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.AuthService.checkStatus().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/menu']); // Si está autenticado, redirige a 'menu'
          return false;
        }
        return true; // Permite el acceso a la página de login
      })
    );
  }
}
