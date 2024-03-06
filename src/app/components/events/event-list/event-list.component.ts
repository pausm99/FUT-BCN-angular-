import { Component } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventFormComponent } from '../event-form/event-form.component';
import { EventService } from '../../../services/event/event.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {

  public events = this.eventService.events;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private eventService: EventService
    ) {
    const url: UrlSegment[] = this.route.snapshot.url;

    if (url && url.length > 0) {
      const create: boolean = url[0].path === 'create';

      if (create) {
        this.modalService.open(EventFormComponent);
      }
    }
    else {
      this.eventService.getEvents();
    }
  }

  goToEvent(id?: number) {
    if (id) {
      this.router.navigate([`events/${id}`]);
    }
  }

}
