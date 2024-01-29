import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../../interfaces/reservation';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  getReservationsByFieldId(fieldId: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${API_URL}/reservations/byField/${fieldId}`);
  }

}
