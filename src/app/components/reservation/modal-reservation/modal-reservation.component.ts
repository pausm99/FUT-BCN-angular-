import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Field } from '../../../interfaces/field';

interface dateStruct {
  date: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-modal-reservation',
  standalone: true,
  imports: [],
  templateUrl: './modal-reservation.component.html',
  styleUrl: './modal-reservation.component.scss'
})
export class ModalReservationComponent {

  private activeModal = inject(NgbActiveModal);

  @Input() field!: Field;

  @Input() start!: string;
  @Input() end!: string;

  date: dateStruct = {
    date: '',
    startTime: '',
    endTime: ''
  };

  ngOnInit(): void {
    this.fillDateStruct();
  }

  fillDateStruct() {
    const dateStart = new Date(this.start);
    const dateEnd = new Date(this.end);

    this.date.date = dateStart.toISOString().split('T')[0];

    this.date.startTime = dateStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
    this.date.endTime = dateEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  }

  confirm() {
    alert('Reservation confirmed!');
    this.activeModal.close();
  }

  cancel() {
    this.activeModal.close({reason: 'cancelled'})
  }

}
