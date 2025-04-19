import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  // API URLs
  private readonly apiBaseUrl = 'http://localhost:5239/api';
  private readonly apiHubUrl = 'http://localhost:5239/blogHub';

  getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  getApiHubUrl(): string {
    return this.apiHubUrl;
  }
}
