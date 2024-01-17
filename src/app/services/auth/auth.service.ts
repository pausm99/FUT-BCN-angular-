import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public logged = signal<boolean>(false);
  public redirectURL: string = '';

  constructor(private userService: UserService) {
    this.logged.set(this.isLoggedIn());
    const decodedTokenFromStorage = this.decodeToken(this.getToken() || '');
    userService.userInfo.set(decodedTokenFromStorage);
  }

  setToken(token: string): void {
    localStorage.setItem('apiToken', token);
    this.logged.set(true);
    const decodedToken = this.decodeToken(token);
    this.userService.userInfo.set(decodedToken);
  }

  getToken(): string | null {
    return localStorage.getItem('apiToken')
  }

  logOut(): void {
    localStorage.removeItem('apiToken');
    this.logged.set(false);
    this.userService.userInfo.set({
      email: '',
      name: '',
      role: ''
    });
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  decodeToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.userSimple;

    return user;
  }
}
