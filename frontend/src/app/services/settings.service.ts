import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../models/settings.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private BASE_URL = environment.api.url + environment.api.apiEndpoint;

  constructor(private http: HttpClient) {}

  getSettings() {
    return this.http.get(`${this.BASE_URL}/translation/settings`);
  }

  updateSettings(settings: Settings) {
    return this.http.put(`${this.BASE_URL}/translation/settings`, {Settings: settings});
  }

  createSettings(settings: Settings) {
    return this.http.post(`${this.BASE_URL}/${settings.LanguageName}/createNew`, {Settings: settings});
  }
}
