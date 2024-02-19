import { Toast } from './../../interfaces/toast';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: Toast[] = [];

  private show(toast: Toast) {
    this.toasts.push(toast);
  }

  private clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  showStandard(text: string) {
		this.show({ text });
	}

	showSuccess(text: string) {
		this.show({ text, classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(text: string) {
		this.show({ text, classname: 'bg-danger text-light', delay: 15000 });
	}

  constructor() { }
}
