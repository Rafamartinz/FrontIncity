import {
  ChangeDetectorRef,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import mapboxgl, { Marker, Point } from 'mapbox-gl';
import { FrontService } from '../../services/front-service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { environment } from './../../../../environments/environment';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { CreateDevice } from '../../interfaces/createDevice.interface';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-menu',
  templateUrl: './Menu.component.html',
  imports: [NavbarComponent, CommonModule],
  styles: [
    `
      #map {
        width: 100vw;
        height: 100vw;
        max-height: 100vh;
      }
    `,
  ],
})
export class MenuComponent implements AfterViewInit {
  @ViewChild('map', { static: false }) divElement!: ElementRef;

  devices = signal<CreateDevice[]>([]);
  frontService = inject(FrontService);

  //Data mapa
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal(14);

  //Data environmental
  environmentalData = signal<any>([]);
  avgTemperature: any = signal(10.2);
  avgPressure: any = signal(1020.21);
  avgHumidity: any = signal(74.9);

  //Data trafffic
  trafficData = signal<any>([]);
  density: any = signal(null);
  actions: any = signal(null);

  //MOstrar mapa y markers
  ngAfterViewInit(): void {
    if (!this.divElement?.nativeElement) return;

    const map = new mapboxgl.Map({
      container: this.divElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-3.7849, 37.7796], // Jaén
      zoom: this.zoom(),
    });

    this.getTraffic();
    this.mapListeners(map);
    this.frontService.getAlldevices().subscribe((devices) => {
      this.devices.set(devices);
      console.log(devices);
      this.ShowDevicesMap();
    });
  }

  ShowDevicesMap() {
    if (!this.map()) return;
    const map = this.map()!;

    const allDevices = this.devices();

    allDevices.forEach((device) => {
      const lat = device.lat;
      const lng = device.lgn;

      new mapboxgl.Marker({
        color:
          '#' +
          Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0'),
      })
        .setLngLat([lat, lng])
        .addTo(map);
    });
  }

  mapListeners(map: mapboxgl.Map) {
    this.map.set(map);
  }

  getTraffic() {
    this.frontService.getTraffic().subscribe({
      next: (data) => {
        console.log(data);
        this.trafficData.set(data);
        this.calculateTrafficStats();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  calculateTrafficStats() {
    const data = this.trafficData();

    let entradas = 0;
    let salidas = 0;
    const actuaciones = new Set();

    for (const item of data) {
      if (item.direction === 0) entradas++;
      if (item.direction === 1) salidas++;
      actuaciones.add(item.plate);
    }

    console.log(entradas);
    console.log(salidas);

    this.density.set(entradas - salidas);
    this.actions.set(actuaciones.size);
  }
}
