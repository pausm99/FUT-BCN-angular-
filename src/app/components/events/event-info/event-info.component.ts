import { Component } from '@angular/core';
import { EventService } from '../../../services/event/event.service';
import { Event } from '../../../interfaces/event';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.scss'
})
export class EventInfoComponent {

  public event!: Event;

  constructor(private eventService: EventService, private router: Router) {
    this.event = this.eventService.activeEvent()
  }

  goToField(id: number) {
    this.router.navigate([`/fields/${id}`]);
  }

}
