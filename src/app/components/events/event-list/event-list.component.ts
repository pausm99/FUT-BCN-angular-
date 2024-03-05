import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  modalService = inject(NgbModal)

  public create: boolean = this.route.snapshot.url[0].path === 'create';

  constructor(
    private route: ActivatedRoute,
    ) {
    if (this.create) {
      this.modalService.open(EventFormComponent);
    }
  }

}
