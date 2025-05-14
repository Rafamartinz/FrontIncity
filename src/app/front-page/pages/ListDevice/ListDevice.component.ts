import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FrontService } from '../../services/front-service';
import { CreateDevice } from '../../interfaces/createDevice.interface';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-device',
  imports: [NavbarComponent, AsyncPipe, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './ListDevice.component.html',
  styleUrls: ['../../../../styles.css'],
})
export class ListDeviceComponent {
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  frontservice = inject(FrontService);
  devices$: Observable<any>;
  FilterForm = this.fb.group({
    type: ['', [Validators.required]],
    fecIni: ['', [Validators.required]],
    fecFin: ['', [Validators.required]],
  });
  constructor() {
    this.devices$ = this.frontservice.getDevices();
  }

  ShowDevices() {
    this.devices$.subscribe({
      next: (devices) => {
        let lat = 0;
        let lgn = 0;
        let fabricante = '';
        let type = '';
        let description = '';
      },
      error: (err) => {
        console.error('Error al obtener los dispositivos', err);
      },
    });
  }
}
