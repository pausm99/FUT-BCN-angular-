import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public role = signal<string>('');

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post<User>(`${API_URL}/user/register`, user);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/user/${email}`);
  }

  login(body: any): Observable<User> {
    return this.http.post<User>(`${API_URL}/user/login`, body);
  }
}
