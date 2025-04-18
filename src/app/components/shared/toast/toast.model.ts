// toast.model.ts
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
