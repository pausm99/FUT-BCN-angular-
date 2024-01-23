import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  public openModalSource = new BehaviorSubject<string>('');
  currentModalValue = this.openModalSource.asObservable();

  constructor() { }

  openModal(modal: string): void {
    this.openModalSource.next(modal);
  }
}
