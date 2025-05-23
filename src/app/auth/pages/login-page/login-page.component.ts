import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormUtils } from '../../../shared/formUtils/formUtils';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'login-page',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  formutils = FormUtils;
  private fb = inject(FormBuilder);
  hasError = signal(false);

  errorMessage: any;
  constructor(private router: Router, private authService: AuthService) {}

  LoginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    //Manda el formulario si es valido con la informacion de inicio de sesion
    if (this.LoginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 3000);
    }

    const { email = '', password = '' } = this.LoginForm.value;
    email?.toLowerCase();
    password?.toLowerCase();

    if (this.LoginForm.valid) {
      this.authService.login(email!, password!).subscribe({
        next: (isAuthenticated) => {
          //Si inicia sesion le lleva a /menu (Menu principal)
          if (isAuthenticated) {
            this.router.navigateByUrl('/menu');
          } else {
            this.hasError.set(true);
            this.errorMessage.set('Usuario o contraseña incorrectos.');
          }
        },
        error: (err) => {
          this.hasError.set(true);
          if (err.status === 401) {
            this.errorMessage.set('Usuario o contraseña incorrectos.');
          } else {
            this.errorMessage.set('Ocurrió un error. Inténtalo de nuevo.');
          }

          setTimeout(() => {
            this.hasError.set(false);
            this.errorMessage.set('');
          }, 3000);
        },
      });
    }
    this.LoginForm.markAllAsTouched();
  }
}
