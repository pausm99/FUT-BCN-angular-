import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Field } from '../../interfaces/field';
import { ToastService } from '../toast/toast.service';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  public fields = signal<Field[]>([]);

  public activeField = signal<Field>({
    company_id: 0,
    name: '',
    type: '',
    location_lat: 0,
    location_lng: 0,
    address: '',
    public: false,
    width: 0,
    length: 0,
    opening_time: '',
    closing_time: ''
  });

  constructor(private http: HttpClient, private toastService: ToastService) {
    this.getAllFields();
  }

  getAllFields(): void {
    this.http.get<Field[]>(`${API_URL}/fields`).subscribe({
      next: (result) => this.fields.set(result),
      error: () => this.toastService.showDanger(`Failed to load fields`)
    })
  }

  createNewField(field: Field): Observable<Field> {
    return this.http.post<Field>(`${API_URL}/fields`, field);
  }

  getFieldsByCompanyId(company_id: number): void {
    this.http.get<Field[]>(`${API_URL}/fields/byCompany?company_id=${company_id}`).subscribe({
      next: (result) => this.fields.set(result),
      error: () => this.toastService.showDanger(`Failed to load fields`)
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

  deleteField(id: number) {
    return this.http.delete<Field>(`${API_URL}/fields/${id}`);
  }
}
