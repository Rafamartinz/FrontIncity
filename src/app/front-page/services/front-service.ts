import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CreateDevice } from '../interfaces/createDevice.interface';
import {
  map,
  Observable,
  of,
  onErrorResumeNextWith,
  switchMap,
  tap,
} from 'rxjs';
import { Zona } from '../interfaces/Zona';

interface DeviceResponse {
  data: CreateDevice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const baseurl = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class FrontService {
  devices: any;
  constructor() {}
  http = inject(HttpClient);

  getEnvironmental() {
    const dataEnvi = this.http.get(`${baseurl}/environmental`);
    return dataEnvi;
  }
  getTraffic() {
    return this.http.get(`${baseurl}/traffic`);
  }

  createDevices(
    lat: number,
    lgn: number,
    type: string,
    zoneId: string,
    fabricante: string,
    description: string,
    guid: string
  ): Observable<any> {
    const body = { lat, lgn, type, zoneId, fabricante, description, guid };
    return this.http.post(`${baseurl}/devices`, body);
  }

  getDevices(
    page: number,
    limit: number,
    type: string,
    fecIni: string,
    endDate: string
  ): Observable<DeviceResponse> {
    return this.http.get<DeviceResponse>(`${baseurl}/devices/filter`, {
      params: {
        fecIni: fecIni,
        EndDate: endDate,
        type: type,
        page: page,
        limit: limit,
      },
    });
  }

  getAlldevices() {
    return this.http.get<CreateDevice[]>(`${baseurl}/devices`);
  }
  /*
  deleteDevicebyID(id: string) {
    return this.http.delete(`${baseurl}/devices/delete`, {
      params: {
        id: id,
      },
    });
  } */

  getDeviceById(id: string): Observable<CreateDevice> {
    return this.http.get<CreateDevice>(`${baseurl}/devices/${id}`);
  }

  getInfoFromDevice(deviceId: string): Observable<any[]> {
    return this.getDeviceById(deviceId).pipe(
      switchMap((device) => {
        const url = `${baseurl}/${device.type}/${device.guid}`;
        return this.http.get<any>(url).pipe(
          //Asegura que la salida siempre sea un array,vengan muchos o uno solo o null
          map((data) => (Array.isArray(data) ? data : data ? [data] : []))
        );
      })
    );
  }

  //Zones
  createZone(description: string, devices: string[]): Observable<any> {
    const body = { description, devices };
    return this.http.post(`${baseurl}/zones`, body);
  }

  getZones() {
    return this.http.get<Zona[]>(`${baseurl}/zones`);
  }

  addDeviceIdToZone(zoneId: string, deviceId: string) {
    return this.http.patch(`${baseurl}/zones/addDeviceId/${zoneId}`, {
      deviceId,
    });
  }
}
