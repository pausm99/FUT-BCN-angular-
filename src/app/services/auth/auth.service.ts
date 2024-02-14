import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public logged = signal<boolean>(false);
  public redirectURL: string | null = null;
  public queryParams: string | null = null;

  constructor(private userService: UserService) {
    this.logged.set(this.isLoggedIn());
    const userInfo = this.getUserInfo();
    if (userInfo) userService.userInfo.set(userInfo);
  }

  setUserInfo(token: string): void {
    this.logged.set(true);
    const decodedToken = this.decodeToken(token);
    if (decodedToken) localStorage.setItem('userInfo', JSON.stringify(decodedToken));
    this.userService.userInfo.set(decodedToken);
  }

  getUserInfo(): any | null {
    const storedData = localStorage.getItem('userInfo');

    try {
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      return null;
    }
  }


  logOut(): void {
    this.userService.logout().subscribe((res) => console.log(res));
    this.logged.set(false);
    localStorage.removeItem('userInfo');
    this.userService.userInfo.set({
      id: 0,
      email: '',
      name: '',
      role: ''
    });
  }

  isLoggedIn(): boolean {
    return this.getUserInfo() !== null;
  }

  decodeToken(token: string): any | null {
    try {
      const decodedToken: any = jwtDecode(token);
      const user = decodedToken.userSimple;
      return user;
    } catch (error) {
      return null;
    }
  }
}
