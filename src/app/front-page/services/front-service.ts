import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateDevice } from '../interfaces/createDevice.interface';
import { Observable, onErrorResumeNextWith, tap } from 'rxjs';

const baseurl = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class FrontService {
  constructor() {}
  http = inject(HttpClient);

  getEnvironmental() {
    return this.http.get(`${baseurl}/environmental`);
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

  getDevices() {
    return this.http
      .get(`${baseurl}/devices`)
      .pipe(tap((response) => console.log(response)));
  }
}
