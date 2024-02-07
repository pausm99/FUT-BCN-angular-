import { Component, Input, inject, signal} from '@angular/core';
import { Field } from '../../../interfaces/field';
import { AvailableReservationsService } from '../../../services/availableReservations/available-reservations.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { FieldService } from '../../../services/field/field.service';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { Reservation } from '../../../interfaces/reservation';
import { AvailableReservation } from '../../../interfaces/available-reservation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalProgramComponent } from './modalProgram/modal.component';
import moment from 'moment';


@Component({
  selector: 'app-program',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss',
})
export class ProgramComponent {

  private modalService = inject(NgbModal);

  @Input() public field!: Field;

  public events = signal<EventInput[]>([]);

  constructor(
    private fieldService: FieldService,
    private availableReservationService: AvailableReservationsService,
    private reservationService: ReservationService
    ) {
      this.field = this.fieldService.activeField();

      this.calendarOptions.slotMinTime = this.field.opening_time;
      this.calendarOptions.slotMaxTime = this.field.closing_time;

      this.initialCalendarViewSize();
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin, interactionPlugin],
    themeSystem: 'bootstrap5',
    firstDay: 1,
    locale: 'es',
    selectable: true,
    nowIndicator: true,
    headerToolbar: {
      left: 'today',
      right: 'prev,next',
      center: 'title',
    },
    eventMaxStack: 1,
    height: 'auto',
    select: (info) => {
      this.createAvailableReservation(info);
    },
    eventClick: (info) => {
      this.deleteEvent(info);
    },
    datesSet: (dates) => {
      this.getDataFromDateRange(dates);
    },
  };

  reservationsToEvents(reservations:(Reservation | AvailableReservation)[]) {

    const now = moment(new Date()).format();

    let formattedEvents: EventInput[] = [];

    reservations.forEach(reservation => {

      const isAvailable = reservation.type === 'available';

      const formattedEvent: EventInput = {
        id: (!isAvailable ? 'res' : 'avRes') + reservation.id,
        start: reservation.date_time_start,
        end: reservation.date_time_end,
        color: !isAvailable ? 'red' : 'green',
      };

      if (isAvailable) {
        const availableReservation = reservation as AvailableReservation;
        formattedEvent.title = availableReservation.price.toString() + '€';
        if (now > moment(availableReservation.date_time_end).format()) {
          formattedEvent.title += ' - [EXPIRED]';
        }
      }

      formattedEvents.push(formattedEvent);

    });
    this.events.update(currentEvents => [...currentEvents, ...formattedEvents]);
  }

  createAvailableReservation(info: any) {

    const modalRef = this.modalService.open(ModalProgramComponent);
    modalRef.componentInstance.title = 'Create available reservation?';
    modalRef.componentInstance.delete = false;
    modalRef.componentInstance.start = info.start;
    modalRef.componentInstance.end = info.end;
    modalRef.closed.subscribe((res) => {
      if (res.reason === 'confirmed') {

        const availableReservation: AvailableReservation = {
          date_time_start: info.start,
          date_time_end: info.end,
          field_id: this.field.id!,
          price: Number(parseFloat(res.price).toFixed(2)),
          blocked: false,
          type: 'available'
        }

        this.availableReservationService.createAvailableReservation(availableReservation).subscribe({
          next: (result) => {
            this.reservationsToEvents([result]);
          }
        })
      }
    })
  }

  deleteEvent(info: any) {
    const event = info.event;

    const id = event._def.publicId
    const isAvailable = id.includes('avRes');

    let text = '';
    text += isAvailable ? 'Delete available' : 'Cancel'
    text += ' reservation?';

    const modalRef = this.modalService.open(ModalProgramComponent);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.delete = true;
    modalRef.componentInstance.start = event.start;
    modalRef.componentInstance.end = event.end;

    modalRef.closed.subscribe((res) => {
      if (res.reason === 'deleted') {

        if (isAvailable) {
          const avResId = id.split('avRes')[1];
          this.availableReservationService.deleteAvailableReservation(avResId).subscribe({
            next: () => event.remove()
          });
        }
        else {
          const resId = id.split('res')[1];
          this.reservationService.deleteReservation(resId).subscribe({
            next: () => event.remove()
          })
        }
      }
    })
  }

  initialCalendarViewSize() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) this.calendarOptions.initialView = 'timeGridDay';
  }

  getDataFromDateRange(dates: DatesSetArg) {
    this.events.set([]);
    this.availableReservationService.getAllTypeByFieldAndTimeRange(this.field?.id!, dates.startStr.split('T')[0], dates.endStr.split('T')[0]).subscribe({
      next: (res) => {
        this.reservationsToEvents(res);
      }
    })
  }

}

