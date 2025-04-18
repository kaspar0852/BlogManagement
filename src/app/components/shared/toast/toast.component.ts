import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { Toast, ToastType } from './toast.model';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent,
} from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  animations: [
    trigger('toastAnimation', [
      // Entry animation
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ]),
      // Exit animation
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({
            opacity: 0,
            transform: 'translateX(100%)',
          })
        ),
      ]),
    ]),
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);

  private readonly TOAST_CLASSES = {
    [ToastType.SUCCESS]: 'bg-green-100 border border-green-200 text-green-800',
    [ToastType.ERROR]: 'bg-red-100 border border-red-200 text-red-800',
    [ToastType.WARNING]:
      'bg-yellow-100 border border-yellow-200 text-yellow-800',
    [ToastType.INFO]: 'bg-blue-100 border border-blue-200 text-blue-800',
  };

  private readonly BUTTON_CLASSES = {
    [ToastType.SUCCESS]: 'text-green-800',
    [ToastType.ERROR]: 'text-red-800',
    [ToastType.WARNING]: 'text-yellow-800',
    [ToastType.INFO]: 'text-blue-800',
  };

  getToastClasses(toast: Toast): string {
    const baseClasses = 'max-w-xs text-sm rounded-lg';
    return `${baseClasses} ${
      this.TOAST_CLASSES[toast.type] ||
      'bg-gray-100 border border-gray-200 text-gray-800'
    }`;
  }

  getCloseButtonClasses(toast: Toast): string {
    return this.BUTTON_CLASSES[toast.type] || 'text-gray-800';
  }

  closeToast(id: string): void {
    this.toastService.removeToast(id);
  }
}
