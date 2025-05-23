import { Component, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../shared/formUtils/formUtils';
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
    lat: [0.0, [Validators.required, Validators.pattern(/^[-+]?\d+(\.\d+)?$/)]],
    lgn: [0.0, [Validators.required, Validators.pattern(/^[-+]?\d+(\.\d+)?$/)]],
    type: ['', [Validators.required]],
    fabricante: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });
  formError = signal(false);
  serverError = signal(false);
  Okmessage = '';
  Nomessage = '';

  //Envio el formulario si es valido
  onSubmit() {
    const {
      lat = 0,
      lgn = 0,
      type = '',
      fabricante = '',
      description = '',
    } = this.CreateForm.value;
    //El guid como se autogenera lo inicio aqui
    const guid: string = '';

    this.Okmessage = '';
    this.Nomessage = '';
    this.formError.set(false);
    this.serverError.set(false);

    //Error del formulario
    if (this.CreateForm.invalid) {
      this.formError.set(true);
      setTimeout(() => this.formError.set(false), 3000);
      return;
    }

    this.frontService
      .createDevices(lat!, lgn!, type!, fabricante!, description!, guid!)
      .subscribe({
        next: (next) => {
          this.Okmessage = 'Registro completado';
          setTimeout(() => (this.Okmessage = ''), 3000);
          this.CreateForm.reset({
            lat: 0.0,
            lgn: 0.0,
            type: '',
            fabricante: '',
            description: '',
          });
        },
        error: (err) => {
          const mensaje =
            //Error del server
            err?.error?.message || 'No hay datos para poner a los dispositivos';
          this.Nomessage = mensaje;
          this.serverError.set(true);

          setTimeout(() => {
            this.Nomessage = '';
            this.serverError.set(false);
          }, 3000);
        },
      });

    this.CreateForm.markAllAsTouched();
  }
}
