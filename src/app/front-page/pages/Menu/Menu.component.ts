import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { FrontService } from '../../services/front-service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { environment } from './../../../../environments/environment';
import { CreateDevice } from '../../interfaces/createDevice.interface';
import { Router } from '@angular/router';

import { Zona } from '../../interfaces/Zona';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-menu',
  templateUrl: './Menu.component.html',
  imports: [NavbarComponent, CommonModule],
  styles: [
    `
      #map {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    `,
  ],
})
export class MenuComponent implements AfterViewInit {
  @ViewChild('map', { static: false }) divElement!: ElementRef;

  router = inject(Router);

  devices = signal<CreateDevice[]>([]);

  DataMarker = signal<CreateDevice | null>(null);

  frontService = inject(FrontService);

  selectedZoneId: string = '';

  //Data mapa
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal(14);
  type: string = '';
  markers: mapboxgl.Marker[] = [];
  zones = signal<Zona[]>([]);

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
      center: [-3.7849, 37.7796], // Jaen
      zoom: this.zoom(),
    });

    this.getTraffic();
    this.mapListeners(map);
    this.frontService.getAlldevices().subscribe((devices) => {
      this.devices.set(devices);
      console.log(devices);
      this.ShowDevicesMap();
    });

    this.getZones();
  }

  //Enseñar los dispositivos
  ShowDevicesMap() {
    if (!this.map()) return;
    const map = this.map()!;
    const allDevices = this.devices();

    // Eliminar marcadores previos
    if (this.markers && this.markers.length > 0) {
      this.markers.forEach((marker) => marker.remove());
      this.markers = [];
    }

    const filteredDevices = allDevices.filter((device) => {
      const matchType = this.type ? device.type === this.type : true;
      const matchZone = this.selectedZoneId
        ? device.zoneId === this.selectedZoneId
        : true;
      return matchType && matchZone;
    });
    filteredDevices.forEach((device) => {
      const lat = device.lat;
      const lng = device.lgn;

      let color = 'red';
      if (device.type === 'traffic') {
        color = 'blue';
      } else if (device.type === 'environmental') {
        color = 'green';
      }

      const marker = new mapboxgl.Marker({ color })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.getElement().classList.add('cursor-pointer');

      marker.getElement().addEventListener('click', () => {
        this.viewDevice(device);
      });

      marker.getElement().addEventListener('mouseenter', () => {
        if (!device) return;
        this.DataMarker.set(device);
      });

      marker.getElement().addEventListener('mouseleave', () => {
        this.DataMarker.set(null);
      });

      // Guardar el marker para poder eliminarlo luego
      this.markers.push(marker);

      /*Intento,pintar mapas
         if (!map.getSource('zona-jaen')) {
        map.addSource('zona-jaen', {
          type: 'geojson',
          data: zonaSurJaenGeoJson,
        });

        map.addLayer({
          id: 'zona-jaen-fill',
          type: 'fill',
          source: 'zona-jaen',
          layout: {},
          paint: {
            'fill-color': '#ff6600', // Naranja
            'fill-opacity': 0.4,
          },
        });

        map.addLayer({
          id: 'zona-jaen-outline',
          type: 'line',
          source: 'zona-jaen',
          layout: {},
          paint: {
            'line-color': '#ff6600',
            'line-width': 2,
          },
        });
      }

        // Zona Sur
      if (!map.getSource('zonasur')) {
        map.addSource('zonasur', {
          type: 'geojson',
          data: zonaNorteGeoJSON,
        });

        map.addLayer({
          id: 'zonasur-fill',
          type: 'fill',
          source: 'zonasur',
          layout: {},
          paint: {
            'fill-color': '#00cc66', // Verde
            'fill-opacity': 0.4,
          },
        });

        map.addLayer({
          id: 'zonasur-outline',
          type: 'line',
          source: 'zonasur',
          layout: {},
          paint: {
            'line-color': '#00cc66',
            'line-width': 2,
          },
        });
      }

      // Zona Oeste
      if (!map.getSource('zonajaenOeste')) {
        map.addSource('zonajaenOeste', {
          type: 'geojson',
          data: zonaSurOesteGeoJSON,
        });

        map.addLayer({
          id: 'zonajaenOeste-fill',
          type: 'fill',
          source: 'zonajaenOeste',
          layout: {},
          paint: {
            'fill-color': '#3366ff', // Azul
            'fill-opacity': 0.4,
          },
        });

        map.addLayer({
          id: 'zonajaenOeste-outline',
          type: 'line',
          source: 'zonajaenOeste',
          layout: {},
          paint: {
            'line-color': '#3366ff',
            'line-width': 2,
          },
        });
      }*/
    });
  }

  mapListeners(map: mapboxgl.Map) {
    this.map.set(map);
  }

  //Metodo necesario para cambiar el valor del select de filtro a string
  ChangeType(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.setType(value);
  }

  //Setteo el valor de lo que pongo en el filtro a el valor de type
  setType(type: string) {
    this.type = type;
    this.ShowDevicesMap();
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

  //CAlculo de entradas y salidas
  calculateTrafficStats() {
    const data = this.trafficData();

    let entradas = 0;
    let salidas = 0;
    const actuaciones = new Set();

    //Sumo todos las direcciones de entrada y salida y la resta es el valor de vehiculos actuales
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

  //Rutas para cuando hago click en un device
  viewDevice(device: any) {
    this.router.navigate(['/dispositivo', device._id]);
  }

  getZones() {
    this.frontService.getZones().subscribe({
      next: (zones) => this.zones.set(zones),
    });
  }

  //Cambio el valor del select a selectedZoneID que es el que utilizo en el metodo para mostrar el mapa

  onZoneChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const zoneid = select.value;

    this.selectedZoneId = zoneid;
    this.ShowDevicesMap();
  }

  //Boolean si es true se muestra el panel de filtros
  showFilters = false;
  ShowFilters() {
    this.showFilters = !this.showFilters;
  }
}
