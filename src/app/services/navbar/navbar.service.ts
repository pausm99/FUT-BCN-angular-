import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private height!: number;

  constructor() { }

  setHeight(height: number) {
    this.height = height;
  }

  getHeight(): number {
    return this.height;
  }
}
