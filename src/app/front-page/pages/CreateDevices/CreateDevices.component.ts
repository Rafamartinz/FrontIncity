import { Component, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import {
  FormBuilder,
  NG_VALIDATORS,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtils } from '../../../shared/formUtils/formUtils';
import { AuthService } from '../../../auth/service/auth.service';
import { FrontService } from '../../services/front-service';
import { NgFor, NgIf } from '@angular/common';
import { Zona } from '../../interfaces/Zona';

@Component({
  selector: 'app-create-devices',
  imports: [NavbarComponent, ReactiveFormsModule, NgFor, NgIf],
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
    zoneId: [''],
    fabricante: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });
  formError = signal(false);
  serverError = signal(false);
  Okmessage = '';
  Nomessage = '';

  constructor() {
    this.getZones();
  }

  //Envio el formulario si es valido
  onSubmit() {
    const {
      lat = 0,
      lgn = 0,
      type = '',
      zoneId = '',
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
      .createDevices(
        lat!,
        lgn!,
        type!,
        zoneId!,
        fabricante!,
        description!,
        guid!
      )
      .subscribe({
        next: (createdDevice) => {
          this.Okmessage = 'Registro completado';
          setTimeout(() => (this.Okmessage = ''), 3000);
          this.CreateForm.reset({
            lat: 0.0,
            lgn: 0.0,
            type: '',
            zoneId: '',
            fabricante: '',
            description: '',
          });

          const deviceId = createdDevice._id;

          // Llamada para actualizar la zona con el nuevo dispositivo
          if (zoneId) {
            this.frontService.addDeviceIdToZone(zoneId, deviceId).subscribe({
              next: () => {
                console.log('Dispositivo agregado a la zona con éxito');
              },
              error: (err: any) => {
                console.error('Error al agregar dispositivo a la zona', err);
              },
            });
          }
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

  zones = signal<Zona[]>([]);

  getZones() {
    this.frontService.getZones().subscribe({
      next: (zones) => this.zones.set(zones),
    });
  }
}
