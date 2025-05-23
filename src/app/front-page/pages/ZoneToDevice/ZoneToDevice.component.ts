import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FrontService } from '../../services/front-service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'zone-to-device',
  standalone: true,
  imports: [NavbarComponent, NgFor],
  templateUrl: './ZoneToDevice.component.html',
})
export class ZoneToDeviceComponent {
  frontservice = inject(FrontService);

  devicesFilter: any[] = [];
  zones: any[] = [];

  constructor() {
    this.getDevices();
    this.getZones();
  }

  getDevices() {
    this.frontservice.getAlldevices().subscribe((devices) => {
      this.devicesFilter = devices.filter((device) => !device.zoneId);
    });
  }

  getZones() {
    this.frontservice.getZones().subscribe((zones) => {
      this.zones = zones;
    });
  }

  addDeviceIdToZone(deviceId: string, zoneId: string) {
    console.log(deviceId);
    console.log(zoneId);
    this.frontservice.addDeviceIdToZone(zoneId, deviceId).subscribe({
      next: () => {
        this.getDevices();
        this.getZones();
      },
      error: (err) => {
        console.error('Error asignando dispositivo a zona:', err);
      },
    });
  }
}
