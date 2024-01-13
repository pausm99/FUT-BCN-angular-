import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem('apiToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('apiToken')
  }
}
