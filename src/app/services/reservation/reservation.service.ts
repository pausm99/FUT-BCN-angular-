import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../../interfaces/reservation';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  public reservations = signal<Reservation[]>([]);

  constructor(private http: HttpClient) { }

  getReservationsByFieldId(fieldId: number) {
    this.http.get<Reservation[]>(`${API_URL}/reservations/byField/${fieldId}`).subscribe({
      next: (res) => {
        this.reservations.set(res);
      }
    })
  }

}
