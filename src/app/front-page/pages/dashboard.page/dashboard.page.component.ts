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
  avgHeat = signal<number | null>(null);

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
        this.createTemperatureChartDaily();
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

    //Meto todos los datos en una variable
    for (const item of data) {
      amountHumidity += item.humidity;
      amountTemperature += item.temperature;
      amountPressure += item.pressure;
    }

    //Lo divido por el length para sacar la media
    const count = data.length;
    const avgHumidity = amountHumidity / count;
    const avgTemperature = amountTemperature / count;

    this.avgHumidity.set(avgHumidity);
    this.avgPressure.set(amountPressure / count);
    this.avgTemperature.set(avgTemperature);

    //Indice de calor
    //Formula
    const vaporPressure =
      (avgHumidity / 100) *
      6.105 *
      Math.exp((17.27 * avgTemperature) / (237.7 + avgTemperature));

    const heatIndex =
      avgTemperature + 0.33 * avgHumidity - 0.7 * vaporPressure - 4.0;

    this.avgHeat.set(heatIndex);
  }

  //Trafico

  getTraffic() {
    this.frontService.getTraffic().subscribe({
      next: (data) => {
        console.log(data);
        this.trafficData.set(data);
        this.calculateTrafficStats();
        this.createTrafficChartDaily();
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

    //Sumo las entradas y salidas para luego restar y sacar "los vehiculos actuales"
    for (const item of data) {
      if (item.direction === 0) entradas++;
      if (item.direction === 1) salidas++;
      actuaciones.add(item.plate);
    }

    console.log(entradas);
    console.log(salidas);

    this.density.set(entradas - salidas);
    //-Todos los vehiculos fuera o dentro (Contados por la matricula)
    this.actions.set(actuaciones.size);
  }

  //Chart
  //Graficos de la temperatura de "hoy"
  createTemperatureChartDaily() {
    const data = this.environmentalData();

    //Muestro de la date las horas  y minutos
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

  //Grafica de entradas y salidas de vehiculos
  createTrafficChartDaily() {
    const data = this.trafficData();

    const hoursMap = new Map<string, { entradas: number; salidas: number }>();

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

    const labels = Array.from(hoursMap.keys());
    const entradasData = labels.map((label) => hoursMap.get(label)!.entradas);
    const salidasData = labels.map((label) => hoursMap.get(label)!.salidas);

    const chartData = {
      labels: labels,
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
            title: {
              display: true,
              text: 'Hora',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Cantidad de vehículos',
            },
            beginAtZero: true,
          },
        },
      },
    };

    new Chart('trafficChart', config);
  }
}
