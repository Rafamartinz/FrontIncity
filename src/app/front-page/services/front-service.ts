import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CreateDevice } from '../interfaces/createDevice.interface';
import { map, Observable, of, onErrorResumeNextWith, tap } from 'rxjs';

const baseurl = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class FrontService {
  constructor() {}
  http = inject(HttpClient);

  getEnvironmental() {
    return this.http.get(`${baseurl}/environmental`);
  }
  getTraffic() {
    return this.http.get(`${baseurl}/traffic`);
  }

  createDevices(
    lat: number,
    lgn: number,
    type: string,
    fabricante: string,
    description: string,
    guid: string
  ): Observable<any> {
    const body = { lat, lgn, type, fabricante, description, guid };
    return this.http.post(`${baseurl}/devices`, body);
  }

  getDevices(
    type: string,
    fecIni: string,
    endDate: string
  ): Observable<CreateDevice[]> {
    return this.http.get<CreateDevice[]>(`${baseurl}/devices/filter`, {
      params: {
        fecIni: fecIni,
        endDate: endDate,
        type: type,
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
}
