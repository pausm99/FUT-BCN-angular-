import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public logged = signal<boolean>(false);

  constructor() {
    this.logged.set(this.isLoggedIn())
  }

  setToken(token: string): void {
    localStorage.setItem('apiToken', token);
    this.logged.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem('apiToken')
  }

  logOut(): void {
    localStorage.removeItem('apiToken');
    this.logged.set(false);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
