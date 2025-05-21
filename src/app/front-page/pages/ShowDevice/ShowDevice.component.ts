import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FrontService } from '../../services/front-service';
import { CommonModule } from '@angular/common';
import { CreateDevice } from '../../interfaces/createDevice.interface';
import { Chart } from 'chart.js';

@Component({
  selector: 'show-device',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './ShowDevice.component.html',
})
export class ShowDeviceComponent implements OnInit {
  route = inject(ActivatedRoute);
  frontservice = inject(FrontService);

  deviceId: string | null = null;
  device: CreateDevice | null = null;

  //Environmental
  environmentalData = signal<any>([]);
  avgTemperature: any = signal(null);
  avgPressure: any = signal(null);
  avgHumidity: any = signal(null);

  //Trafico
  trafficData = signal<any>([]);
  density: any = signal(null);
  actions: any = signal(null);
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/ListDevice']);
  }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('id');

    if (this.deviceId) {
      this.frontservice.getDeviceById(this.deviceId).subscribe((data) => {
        this.device = data;

        this.createTrafficChart();

        this.createTemperatureChart();

        this.getEnvironmentalInfoDevice();
        this.getTrafficInfoDevice();
      });
    }
  }

  getTrafficInfoDevice() {
    this.frontservice.getInfoFromDevice(this.deviceId ?? '').subscribe({
      next: (data: any[]) => {
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

    if (Array.isArray(data)) {
      let entradas = 0;
      let salidas = 0;
      const actuaciones = new Set();

      for (const item of data) {
        if (item.direction === 0) entradas++;
        if (item.direction === 1) salidas++;
        actuaciones.add(item.plate);
      }

      this.density.set(entradas - salidas);
      this.actions.set(actuaciones.size);
    }
  }

  //Environmental

  getEnvironmentalInfoDevice() {
    this.frontservice.getInfoFromDevice(this.deviceId ?? '').subscribe({
      next: (data: any[]) => {
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

    if (Array.isArray(data)) {
      for (const item of data) {
        amountHumidity += item.humidity;
        amountTemperature += item.temperature;
        amountPressure += item.pressure;
      }
    }

    const count = data.length;
    const avgHumidity = amountHumidity / count;
    const avgTemperature = amountTemperature / count;

    this.avgHumidity.set(avgHumidity);
    this.avgPressure.set(amountPressure / count);
    this.avgTemperature.set(avgTemperature);
  }

  createTrafficChart() {
    this.frontservice
      .getInfoFromDevice(this.deviceId ?? '')
      .subscribe((data: any) => {
        if (!data) {
          console.log('No hay info de tráfico');
          return;
        }
        console.log('La data', data);

        if (Array.isArray(data)) {
          const hoursMap = new Map<
            string,
            { entradas: number; salidas: number }
          >();

          for (const item of data) {
            const date = new Date(item.date);
            const hour = date.getHours().toString().padStart(2, '0') + ':00';

            if (!hoursMap.has(hour)) {
              hoursMap.set(hour, { entradas: 0, salidas: 0 });
            }

            const current = hoursMap.get(hour)!;

            if (item.direction === 0) current.entradas += 1;
            if (item.direction === 1) current.salidas += 1;
          }

          const labels = Array.from(hoursMap.keys()).sort();
          const entradasData = labels.map(
            (label) => hoursMap.get(label)!.entradas
          );
          const salidasData = labels.map(
            (label) => hoursMap.get(label)!.salidas
          );

          this.createChart(labels, entradasData, salidasData);
        } else {
          // Si es un solo objeto, lo procesamos directamente
          const date = new Date(data.date);
          const hour = date.getHours().toString().padStart(2, '0') + ':00';
          const entradas = data.direction === 0 ? 1 : 0;
          const salidas = data.direction === 1 ? 1 : 0;

          this.createChart([hour], [entradas], [salidas]);
        }
      });
  }

  createChart(labels: string[], entradasData: number[], salidasData: number[]) {
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Entradas',
          data: entradasData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Salidas',
          data: salidasData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };

    const config = {
      type: 'bar' as const,
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Hora' },
          },
          y: {
            title: { display: true, text: 'Cantidad de vehículos' },
            beginAtZero: true,
          },
        },
      },
    };

    new Chart('trafficChart', config);
  }

  createTemperatureChart() {
    this.frontservice
      .getInfoFromDevice(this.deviceId ?? '')
      .subscribe((data: any) => {
        console.log('Data recibida:', data);

        const environmentalArray = Array.isArray(data) ? data : [data];

        if (environmentalArray.length === 0) {
          console.log('No hay info ambiental');
          return;
        }

        const labels = environmentalArray.map((item: { date: any }) => {
          const date = new Date(item.date);
          return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
        });

        const temperatures = environmentalArray.map(
          (item: { temperature: any }) => item.temperature
        );

        const chartData = {
          labels,
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: temperatures,
              borderColor: 'orange',
              tension: 0.3,
              fill: false,
            },
          ],
        };

        const config = {
          type: 'line' as const,
          data: chartData,
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Fecha',
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Temperatura (°C)',
                },
              },
            },
          },
        };

        new Chart('temperatureChart', config);
      });
  }
}
