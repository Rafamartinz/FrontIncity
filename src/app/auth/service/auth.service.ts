import { HttpClient } from '@angular/common/http';
import { computed, signal, inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthResponse } from '../interface/authResponse';
import { User } from '../interface/interfaceUser';
import { Router } from '@angular/router';

const baseurl = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  user = computed(() => this._user());
  token = computed(this._token);
  private http = inject(HttpClient);
  router = inject(Router);

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseurl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),

        tap((resp) => console.log('  RESPUESTA REGISTER:', resp))
      );
  }

  register(
    email: string,
    password: string,
    fullname: string
  ): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseurl}/auth/register`, {
        email: email,
        password: password,
        fullName: fullname,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        tap((resp) => console.log('RESPUESTA :', resp))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseurl}/auth/check-status`, {}).pipe(
      map((resp) => {
        return this.handleAuthSuccess(resp);
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem('token', token);
    return true;
  }

  logout() {
    localStorage.removeItem('token');
  }
}
