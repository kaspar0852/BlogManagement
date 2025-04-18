import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  error(message: string, meta?: any): void {
    console.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    console.warn(message, meta);
  }

  info(message: string, meta?: any): void {
    console.info(message, meta);
  }

  debug(message: string, meta?: any): void {
    console.debug(message, meta);
  }
}
