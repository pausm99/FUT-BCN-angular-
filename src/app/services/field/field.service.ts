import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Field } from '../../interfaces/field';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  public fields = signal<Field[]>([]);

  constructor(private http: HttpClient) {
    this.getAllFields();
  }

  getAllFields(): void {
    this.http.get<Field[]>(`${API_URL}/fields`).subscribe({
      next: (result) => this.fields.set(result)
    })
  }

  createNewField(field: Field): Observable<Field> {
    return this.http.post<Field>(`${API_URL}/fields`, field);
  }

  getFieldsByCompanyId(company_id: number): void {
    this.http.get<Field[]>(`${API_URL}/fields/byCompany?company_id=${company_id}`).subscribe({
      next: (result) => this.fields.set(result)
    })
  }

  getFieldById(id: number): Observable<Field> {
    return this.http.get<Field>(`${API_URL}/fields/${id}`);
  }

  setFieldSignalByType(companyID: number | null) {
    if (companyID) {
      this.getFieldsByCompanyId(companyID);
    } else {
      this.getAllFields();
    }
  }
}
