import { Injectable, inject } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toastr = inject(ToastrService);

  private baseConfig: Partial<IndividualConfig> = {
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
    progressAnimation: 'decreasing',
    positionClass: 'toast-top-right',
    tapToDismiss: true,
  };

  success(message: string, title = 'Sucesso') {
    setTimeout(() => {
      this.toastr.success(message, title, this.baseConfig);
    }, 0);
  }

  error(message: string, title = 'Erro') {
    setTimeout(() => {
      this.toastr.error(message, title, this.baseConfig);
    }, 0);
  }

  info(message: string, title = 'Informação') {
    setTimeout(() => {
      this.toastr.info(message, title, this.baseConfig);
    }, 0);
  }

  warning(message: string, title = 'Atenção') {
    setTimeout(() => {
      this.toastr.warning(message, title, this.baseConfig);
    }, 0);
  }

  show(message: string, title?: string, config?: Partial<IndividualConfig>) {
    setTimeout(() => {
      this.toastr.show(message, title, {
        ...this.baseConfig,
        ...config,
      });
    }, 0);
  }

  clear() {
    this.toastr.clear();
  }
}
