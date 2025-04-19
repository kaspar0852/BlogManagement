import { Injectable, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';

import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';
import { ToastService } from '../components/shared/toast/toast.service';
import { HubBlogData } from '../components/blog/blog.model';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private toastr = inject(ToastService);
  private logger = inject(LoggerService);
  private envService = inject(EnvService);

  // Subjects to emit notifications to components
  private newBlogSubject = new Subject<any>();
  newBlog$ = this.newBlogSubject.asObservable();

  public startConnection = async () => {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.envService.getApiHubUrl())
        .withAutomaticReconnect()
        .build();

      await this.hubConnection.start();
      this.logger.info('SignalR Connected');
      this.registerHandlers();
    } catch (error) {
      this.logger.error('Error while starting SignalR connection', { error });
      // Retry connection
      setTimeout(() => this.startConnection(), 5000);
    }
  };

  private registerHandlers(): void {
    // Listen for new blog notifications
    this.hubConnection.on('ReceiveNewBlogPost', (blog: HubBlogData) => {
      this.logger.info('New blog notification received', { blog: blog });
      this.newBlogSubject.next(blog);
    });

    // Listen for connection status
    this.hubConnection.onreconnecting((error) => {
      this.logger.warn('Attempting to reconnect...', { error });
    });

    this.hubConnection.onreconnected((connectionId) => {
      this.logger.info('Reconnected to SignalR hub', { connectionId });
    });

    this.hubConnection.onclose((error) => {
      this.logger.error('SignalR connection closed', { error });
    });
  }

  public stopConnection = async () => {
    try {
      await this.hubConnection?.stop();
      this.logger.info('SignalR Connection Stopped');
    } catch (error) {
      this.logger.error('Error while stopping SignalR connection', { error });
    }
  };

  // Method to invoke hub methods (if needed)
  public async invokeHub(methodName: string, ...args: any[]) {
    try {
      await this.hubConnection.invoke(methodName, ...args);
    } catch (error) {
      this.logger.error(`Error invoking hub method: ${methodName}`, { error });
      throw error;
    }
  }
}
