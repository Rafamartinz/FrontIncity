import {
  Component,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormUtils } from '../../formUtils/formUtils';
import { NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, NgIf, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  formutils = FormUtils;
  private fb = inject(FormBuilder);
  hasError = signal(false);

  constructor(private authservice: AuthService, private router: Router) {}

  RegisterForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.maxLength(15)]],
  });

  onSubmit() {
    if (this.RegisterForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 3000);
    }
    let { email = '', password = '', fullName = '' } = this.RegisterForm.value;

    email = (this.RegisterForm.value.email ?? '').toLowerCase();
    fullName = (this.RegisterForm.value.fullName ?? '').toLowerCase();

    if (this.RegisterForm.valid) {
      this.authservice.register(email!, password!, fullName!).subscribe(() => {
        this.router.navigate(['/']);
      });
    }

    this.RegisterForm.markAllAsTouched();

    console.log(this.RegisterForm.value);
  }
}
