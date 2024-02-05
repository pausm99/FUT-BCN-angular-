import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AvailableReservation } from '../../interfaces/available-reservation';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class AvailableReservationsService {

  public availableReservations = signal<AvailableReservation[]>([])

  constructor(private http: HttpClient) { }

  getAvailableReservationsByFieldId(fieldId: number) {
    this.http.get<AvailableReservation[]>(`${API_URL}/availableReservations/byField/${fieldId}`).subscribe({
      next: (res) => {
        this.availableReservations.set(res);
      }
    })
  }

  createAvailableReservation(availableReservation: AvailableReservation): Observable<any> {
    return this.http.post<AvailableReservation>(`${API_URL}/availableReservations`, availableReservation);
  }

  getAvailableAndOccupiedReservations(fieldId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/availableReservations/occupied/${fieldId}`);
  }

  createBulkAvailableReservation(bulkReservations: AvailableReservation[]) {
    this.http.post<AvailableReservation[]>(`${API_URL}/availableReservations/bulk`, bulkReservations).subscribe({
      next: (res) => {
        this.availableReservations.update(items => [...items, ...res]);
      }
    })
  }

  deleteAvailableReservation(id: number) {
    return this.http.delete<AvailableReservation>(`${API_URL}/availableReservations/${id}`);
  }
}
