import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FrontService } from '../../services/front-service';
import { CreateDevice } from '../../interfaces/createDevice.interface';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-device',
  imports: [NavbarComponent, AsyncPipe, NgIf, NgFor],
  templateUrl: './ListDevice.component.html',
  styleUrls: ['../../../../styles.css'],
})
export class ListDeviceComponent {
  http = inject(HttpClient);
  frontservice = inject(FrontService);
  devices$: Observable<any>;

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

        for (const item of devices) {
          lat = item.lat;
          lgn = item.lgn;
          fabricante = item.fabricante;
          type = item.type;
          description = item.description;
          console.log(lat, lgn, fabricante, type, description);
        }
      },
      error: (err) => {
        console.error('Error al obtener los dispositivos', err);
      },
    });
  }
}
