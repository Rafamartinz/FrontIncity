import { NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../shared/formUtils/formUtils';
import { FrontService } from '../../services/front-service';
import { Zona } from '../../interfaces/Zona';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modify-device',
  imports: [NgIf, NavbarComponent, ReactiveFormsModule, NgFor],
  templateUrl: './ModifyDevice.component.html',
})
export class ModifyDeviceComponent {
  formutils = FormUtils;
  private fb = inject(FormBuilder);
  hasError = signal(false);
  frontService = inject(FrontService);
  zones = signal<Zona[]>([]);
  route = inject(ActivatedRoute);
  router = inject(Router);

  formError = signal(false);
  serverError = signal(false);
  Okmessage = '';
  Nomessage = '';
  deviceId = this.route.snapshot.paramMap.get('id');

  constructor() {
    this.getZones();
  }

  ModifyForm = this.fb.group({
    lat: [0.0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    lgn: [
      0.0,
      [Validators.required, Validators.min(-180), Validators.max(180)],
    ],
    type: ['', [Validators.required]],
    zoneId: [''],
    fabricante: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  onSubmit() {
    const {
      lat = 0,
      lgn = 0,
      type = '',
      fabricante = '',
      description = '',
      zoneId = '',
    } = this.ModifyForm.value;
    //El guid como se autogenera lo inicio aqui
    const guid: string = '';
    console.log(this.ModifyForm.value);
    const createdAt: any = 0;

    this.Okmessage = '';
    this.Nomessage = '';
    this.formError.set(false);
    this.serverError.set(false);

    //Error del formulario
    if (this.ModifyForm.invalid) {
      this.formError.set(true);
      setTimeout(() => this.formError.set(false), 3000);
      return;
    }
    if (this.ModifyForm.valid) {
      this.router.navigate(['/ListDevice']);
    }

    this.frontService
      .modifyDevice(
        this.deviceId!,
        lat!,
        lgn!,
        type!,
        fabricante!,
        description!,
        zoneId!,
        guid!,
        createdAt!
      )
      .subscribe({
        next: (createdDevice) => {
          this.Okmessage = 'Dispositivo Modificado correctamente';
          setTimeout(() => (this.Okmessage = ''), 3000);
          this.ModifyForm.reset({
            lat: 0.0,
            lgn: 0.0,
            type: '',
            zoneId: '',
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

    this.ModifyForm.markAllAsTouched();
  }

  getZones() {
    this.frontService.getZones().subscribe({
      next: (zones) => this.zones.set(zones),
    });
  }
}
