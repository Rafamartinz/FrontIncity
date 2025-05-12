import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-menu',
  templateUrl: './Menu.component.html',
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

  map = signal<mapboxgl.Map | null>(null);
  zoom = signal(14);

  ngAfterViewInit(): void {
    if (!this.divElement?.nativeElement) return;

    const map = new mapboxgl.Map({
      container: this.divElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-3.7849, 37.7796], // Jaén
      zoom: this.zoom(),
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl());

    this.map.set(map);
  }
}
