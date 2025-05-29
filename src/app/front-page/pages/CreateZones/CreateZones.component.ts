import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FrontService } from '../../services/front-service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'create-zones',
  imports: [NavbarComponent, ReactiveFormsModule, NgIf, RouterLink, NgFor],
  templateUrl: './CreateZones.component.html',
})
export class CreateZonesComponent implements OnInit {
  fb = inject(FormBuilder);
  frontservice = inject(FrontService);
  showDevices = false;

  CreateForm = this.fb.group({
    description: ['', [Validators.required]],
    devices: [<string[]>[], [Validators.required]],
  });

  devicesFilter = signal<any[]>([]);

  ngOnInit() {
    this.getDevices();
  }

  onSubmit() {
    const description = this.CreateForm.get('description')?.value ?? '';
    const devices = this.CreateForm.get('devices')?.value ?? [];

    this.frontservice.createZone(description, devices).subscribe({
      next: () => {
        this.CreateForm.reset();
        this.CreateForm.get('devices')?.setValue([]);
        this.CreateForm.get('description')?.setValue('');
      },
      error: (err) => {
        console.error('Error creando zona:', err);
      },
    });
    console.log(this.CreateForm.value);
    this.CreateForm.markAllAsTouched();
  }

  getDevices() {
    this.frontservice.getAlldevices().subscribe((devices) => {
      const devicesWithoutZone = devices.filter((device) => !device.zoneId);
      this.devicesFilter.set(devicesWithoutZone);
    });
  }

  GetIdFromDevice(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    let devicesZone = this.CreateForm.get('devices')?.value ?? [];

    if (checkbox.checked) {
      if (!devicesZone.includes(checkbox.value)) {
        devicesZone.push(checkbox.value);
      }
    } else {
      devicesZone = devicesZone.filter((id) => id !== checkbox.value);
    }

    /* Actualiza el campo devices del formulario con la nueva lista de IDs. */
    this.CreateForm.patchValue({ devices: devicesZone });
    /* Llama a updateValueAndValidity  para que   actualice el estado del campo si era obligatorio y ahora esta vacio, se marca como invalido   */
    this.CreateForm.get('devices')?.updateValueAndValidity();
  }
}
