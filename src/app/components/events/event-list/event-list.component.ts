import { Component } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {

  constructor(private route: ActivatedRoute, private modalService: NgbModal) {
    const url: UrlSegment[] = this.route.snapshot.url;

    if (url && url.length > 0) {
      const create: boolean = url[0].path === 'create';

      if (create) {
        this.modalService.open(EventFormComponent);
      }
    }
  }

}
