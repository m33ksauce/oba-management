import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  private BASE_URL = environment.api.url + environment.api.apiEndpoint;

  constructor(private http: HttpClient) {}

  publishRelease(translation) {
    return this.http.post(`${this.BASE_URL}/${translation}/release/generate`, '');
  }
}
