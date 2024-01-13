import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private height!: number;
  public openModalSource = new BehaviorSubject<string>('');
  currentModalValue = this.openModalSource.asObservable();

  constructor() { }

  setHeight(height: number) {
    this.height = height;
  }

  getHeight(): number {
    return this.height;
  }

  openModal(modal: string): void {
    this.openModalSource.next(modal);
  }
}
