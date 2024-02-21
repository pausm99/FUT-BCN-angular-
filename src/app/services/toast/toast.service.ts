import { Toast } from './../../interfaces/toast';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toast?: Toast;

  private show(toast: Toast) {
    this.toast = toast;
  }

  private clear() {
    this.toast = undefined;
  }

  remove(toast: Toast) {
    this.toast = undefined;
  }

  showStandard(text: string) {
		this.show({ text });
	}

	showSuccess(text: string) {
		this.show({ text, classname: 'bg-success text-light', delay: 5000 });
	}

	showDanger(text: string) {
		this.show({ text, classname: 'bg-danger text-light', delay: 5000 });
	}

  constructor() { }
}
