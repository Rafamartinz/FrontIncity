// src/app/auth/guards/authenticated.guard.ts
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
export class AuthenticatedGuard implements CanActivate {
  constructor(private AuthService: AuthService, private router: Router) {}
  // Guard que redirige al login si el usuario no está autenticado

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica el estado de autenticación usando el método checkStatus()
    return this.AuthService.checkStatus().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/auth/login']);
          return false;
        }
      })
    );
  }
}
