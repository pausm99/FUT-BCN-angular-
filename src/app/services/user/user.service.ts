import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post<User>('http://localhost:3000/user/register', user);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/user/${email}`);
  }

  login(body: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/user/login`, body);
  }

  secret(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/secret`);
  }
}
