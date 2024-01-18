import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Field } from '../../interfaces/field';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(private http: HttpClient) { }

  getAllFields(): Observable<Field[]> {
    return this.http.get<Field[]>(`${API_URL}/fields`);
  }

  createNewField(field: Field): Observable<Field> {
    return this.http.post<Field>(`${API_URL}/fields`, field);
  }
}
