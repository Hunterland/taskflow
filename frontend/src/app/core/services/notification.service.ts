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
    this.toastr.success(message, title, this.baseConfig);
  }

  error(message: string, title = 'Erro') {
    this.toastr.error(message, title, this.baseConfig);
  }

  info(message: string, title = 'Informação') {
    this.toastr.info(message, title, this.baseConfig);
  }

  warning(message: string, title = 'Atenção') {
    this.toastr.warning(message, title, this.baseConfig);
  }

  show(message: string, title?: string, config?: Partial<IndividualConfig>) {
    this.toastr.show(message, title, {
      ...this.baseConfig,
      ...config,
    });
  }

  clear() {
    this.toastr.clear();
  }
}
