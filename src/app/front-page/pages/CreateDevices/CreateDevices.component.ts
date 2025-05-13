import { Component, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../auth/formUtils/formUtils';
import { AuthService } from '../../../auth/service/auth.service';
import { FrontService } from '../../services/front-service';
import { NgIf } from '@angular/common';
import { createFind } from 'rxjs/internal/operators/find';

@Component({
  selector: 'app-create-devices',
  imports: [NavbarComponent, ReactiveFormsModule, NgIf],
  templateUrl: './CreateDevices.component.html',
})
export class CreateDevicesComponent {
  formutils = FormUtils;
  private fb = inject(FormBuilder);
  hasError = signal(false);
  frontService = inject(FrontService);

  CreateForm = this.fb.group({
    lat: [0.0, [Validators.required]],
    lgn: [0.0, [Validators.required]],
    type: ['', [Validators.required]],
    fabricante: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });
  errorMessage = '';

  onSubmit() {
    const {
      lat = 0,
      lgn = 0,
      type = '',
      fabricante = '',
      description = '',
    } = this.CreateForm.value;
    const guid: string = '';

    if (this.CreateForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 3000);
    }

    if (this.CreateForm.valid) {
      this.frontService
        .createDevices(lat!, lgn!, type!, fabricante!, description!, guid!)
        .subscribe({
          error: (err) => {
            this.hasError.set(true);
            if (err.status === 401) {
            } else {
              console.log(err);
              this.errorMessage = 'Noooo ocurrió un error...';
            }

            setTimeout(() => {
              this.hasError.set(false);
              this.errorMessage = ' ';
            }, 3000);
          },
        });
      console.log(this.CreateForm.value);
    }
    this.CreateForm.markAllAsTouched();
  }
}
