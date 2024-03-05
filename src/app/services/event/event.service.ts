import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Event } from '../../interfaces/event';
import { environment } from '../../../environments/environment';
import { ToastService } from '../toast/toast.service';

const API_URL: string = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient, private toastService: ToastService) { }

  public events = signal<Event[]>([]);

  createEvent(event: Event) {
    this.http.post<Event>(`${API_URL}/events`, event).subscribe({
      next: (result) => {
        this.toastService.showSuccess('Event successfully created');
        this.events.update((currentEvents) => [...currentEvents, result])
      },
      error: () => this.toastService.showDanger('Failed to create new event')
    })
  }
}
