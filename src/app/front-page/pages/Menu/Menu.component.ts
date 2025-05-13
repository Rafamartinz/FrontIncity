import {
  ChangeDetectorRef,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import mapboxgl, { Point } from 'mapbox-gl';
import { FrontService } from '../../services/front-service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { environment } from './../../../../environments/environment';
import {
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PieController,
  LinearScale,
  RadialLinearScale,
  LineController,
  TimeScale,
  CategoryScale,
  PointElement,
  LineElement,
  Chart,
  Filler,
} from 'chart.js';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  Title,
  LinearScale,
  RadialLinearScale,
  LineController,
  TimeScale,
  CategoryScale,
  PointElement,
  LineElement,
  Filler
);

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

  frontService = inject(FrontService);
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal(14);

  environmentalData = signal<any>([]);
  avgTemperature: any = signal(null);
  avgPressure: any = signal(null);
  avgHumidity: any = signal(null);

  ngAfterViewInit(): void {
    if (!this.divElement?.nativeElement) return;

    const map = new mapboxgl.Map({
      container: this.divElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-3.7849, 37.7796], // Jaén
      zoom: this.zoom(),
    });
    this.getEnvironmental();
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl());
    this.map.set(map);
  }

  getEnvironmental() {
    this.frontService.getEnvironmental().subscribe({
      next: (data) => {
        console.log(data);
        this.environmentalData.set(data);
        this.calculateAverage();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  calculateAverage() {
    const data = this.environmentalData();
    let amountHumidity = 0;
    let amountTemperature = 0;
    let amountPressure = 0;

    for (const item of data) {
      amountHumidity += item.humidity;
      amountTemperature += item.temperature;
      amountPressure += item.pressure;
    }

    this.avgHumidity.set(amountHumidity / data.length);
    this.avgPressure.set(amountPressure / data.length);
    this.avgTemperature.set(amountTemperature / data.length);
  }
  /*
  private tempChart: Chart | null = null;
  private pressureChart: Chart | null = null;
  private humidityChart: Chart | null = null;

  createCharts() {
    const data = this.environmentalData();
    const labels = data.map((item: any) =>
      new Date(item.timestamp).toLocaleTimeString()
    );

    const destroyIfExists = (chart: Chart | null) => {
      if (chart) chart.destroy();
    };

    // Temperatura
    destroyIfExists(this.tempChart);
    this.tempChart = new Chart(
      this.temperatureCanvas.nativeElement.getContext('2d'),
      {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: data.map((item: any) => item.temperature),
              borderColor: 'red',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: false },
          },
        },
      }
    );

    // Presión
    destroyIfExists(this.pressureChart);
    this.pressureChart = new Chart(
      this.pressureCanvas.nativeElement.getContext('2d'),
      {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Presión (hPa)',
              data: data.map((item: any) => item.pressure),
              borderColor: 'blue',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: false },
          },
        },
      }
    );

    // Humedad
    destroyIfExists(this.humidityChart);
    this.humidityChart = new Chart(
      this.humidityCanvas.nativeElement.getContext('2d'),
      {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Humedad (%)',
              data: data.map((item: any) => item.humidity),
              borderColor: 'green',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true },
          },
        },
      }
    );
  } */
}
