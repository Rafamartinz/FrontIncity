import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FrontService } from '../../services/front-service';
import { CommonModule } from '@angular/common';

import { Chart, Colors, registerables } from 'chart.js';
import { map } from 'rxjs/operators';

Chart.register(...registerables);

@Component({
  selector: 'dashboard.page',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './dashboard.page.component.html',
})
export class DashboardPageComponent implements AfterViewInit {
  frontService = inject(FrontService);
  //Data environmental
  environmentalData = signal<any>([]);
  avgTemperature: any = signal(null);
  avgPressure: any = signal(null);
  avgHumidity: any = signal(null);

  //Data trafffic
  trafficData = signal<any>([]);
  density: any = signal(null);
  actions: any = signal(null);

  ngAfterViewInit(): void {
    this.getEnvironmental();
    this.getTraffic();
  }

  getEnvironmental() {
    this.frontService.getEnvironmental().subscribe({
      next: (data) => {
        console.log(data);
        this.environmentalData.set(data);
        this.calculateAverage();
        this.createTemperatureChart();
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

    const count = data.length;
    this.avgHumidity.set(amountHumidity / count);
    this.avgPressure.set(amountPressure / count);
    this.avgTemperature.set(amountTemperature / count);
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

  /*
1. Índice de calor (Heat Index)
Combinando temperatura y humedad, puedes calcular el índice de calor, que indica cómo se siente realmente la temperatura (más útil en climas cálidos y húmedos como los de verano en Jaén).

Fórmula aproximada (simplificada):

𝐻
𝐼
=
𝑇
+
0.33
∗
𝐻
−
0.70
∗
𝑃
−
4.00
HI=T+0.33∗H−0.70∗P−4.00
O usar fórmulas más precisas si usas código (como Python con metpy). */

  //Chart

  createTemperatureChart() {
    const data = this.environmentalData();

    const labels = data.map((item: { date: any }) => {
      const date = new Date(item.date);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    });

    const temperatures = data.map(
      (item: { temperature: any }) => item.temperature
    );

    const chartData = {
      labels: labels,
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
  }
}
