import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FrontService } from '../../services/front-service';
import { CreateDevice } from '../../interfaces/createDevice.interface';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-device',
  imports: [NavbarComponent, ReactiveFormsModule, NgFor, PaginationComponent],
  templateUrl: './ListDevice.component.html',
  styleUrls: ['../../../../styles.css'],
})
export class ListDeviceComponent {
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  frontservice = inject(FrontService);
  router = inject(Router);
  totalPagesCount = 0;

  //Pagination
  devices: any[] = [];
  devicesPorpage = 5;
  currentPage = 1;

  FilterForm = this.fb.group({
    type: [''],
    fecIni: [''],
    fecFin: [''],
  });
  deviceCache = new Map<string, any[]>();

  private generateCacheKey(
    type: string,
    fecIni: string,
    fecFin: string
  ): string {
    return `${type}|${fecIni}|${fecFin}`;
  }

  ShowDevices(page: number = 1) {
    const fecIniValue = this.FilterForm.controls['fecIni']?.value as string;
    const fecFinValue = this.FilterForm.controls['fecFin']?.value as string;
    const type = this.FilterForm.controls['type']?.value as string;
    const cacheKey = this.generateCacheKey(type, fecIniValue, fecFinValue);

    if (this.deviceCache.has(cacheKey)) {
      this.devices = this.deviceCache.get(cacheKey)!;

      return;
    }

    this.frontservice
      .getDevices(page, this.devicesPorpage, type, fecIniValue, fecFinValue)
      .subscribe({
        next: (response: any) => {
          this.devices = response.data;
          this.currentPage = Number(response.page);
          this.totalPagesCount = Number(response.totalPages);
        },
        error: (err) => {
          console.error('Error al obtener los dispositivos', err);
        },
      });
  }
  onPageChange(page: number) {
    this.ShowDevices(page);
  }

  //Lleva a el user a la info de ese dispositivo con ese _id
  viewDevice(device: any) {
    this.router.navigate(['/dispositivo', device._id]);
  }
  /*
  deleteDevice(id: string) {
    this.frontservice.deleteDevicebyID(id).subscribe(() => {
      this.devices = this.devices.filter((device) => device._id !== id);
      this.setPage(this.currentPage);
    });
  } */
}
