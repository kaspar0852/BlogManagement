// toast.service.ts
import { Injectable, signal } from '@angular/core';
import { ToastType } from './toast.model';
import { Toast } from './toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  public activeToasts = this.toasts.asReadonly();

  showToast(message: string, type: ToastType, duration: number = 3000) {
    const id = Date.now().toString();
    const toast: Toast = {
      id,
      message,
      type,
      duration,
    };

    this.toasts.update((toasts) => [...toasts, toast]);

    setTimeout(() => {
      this.removeToast(id);
    }, duration);

    return id;
  }

  showSuccess(message: string, duration: number = 3000) {
    return this.showToast(message, ToastType.SUCCESS, duration);
  }

  showError(message: string, duration: number = 3000) {
    return this.showToast(message, ToastType.ERROR, duration);
  }

  showWarning(message: string, duration: number = 3000) {
    return this.showToast(message, ToastType.WARNING, duration);
  }

  showInfo(message: string, duration: number = 3000) {
    return this.showToast(message, ToastType.INFO, duration);
  }

  removeToast(id: string) {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
