import { Component, Input, effect, inject, signal} from '@angular/core';
import { Field } from '../../../interfaces/field';
import { AvailableReservationsService } from '../../../services/availableReservations/available-reservations.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
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

  public reservationsSignal = this.reservationService.reservations;
  public reservations: Reservation[] = [];

  public availableReservationsSignal = this.availableReservationService.availableReservations;
  public availableReservations: AvailableReservation[] = [];

  public events = signal<EventInput[]>([]);


  constructor(
    private fieldService: FieldService,
    private availableReservationService: AvailableReservationsService,
    private reservationService: ReservationService
    ) {
      this.field = this.fieldService.activeField();

      this.calendarOptions.slotMinTime = this.field.opening_time;
      this.calendarOptions.slotMaxTime = this.field.closing_time;

      this.reservationService.getReservationsByFieldId(this.field.id!);
      this.availableReservationService.getAvailableReservationsByFieldId(this.field.id!);

      effect(() => {
        this.reservations = this.reservationsSignal();
        this.reservationsToEvents(this.reservations, false);
      }, { allowSignalWrites: true });

      effect(() => {
        this.availableReservations = this.availableReservationsSignal();
        this.reservationsToEvents(this.availableReservations, true);
      }, { allowSignalWrites: true });
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
    }
  };

  reservationsToEvents(reservations: Reservation[] | AvailableReservation[], isAvailable: boolean) {

    let formattedEvents: EventInput[] = [];

    reservations.forEach(reservation => {

      const formattedEvent: EventInput = {
        start: reservation.date_time_start,
        end: reservation.date_time_end,
        color: !isAvailable ? 'red' : 'green',
        display: !isAvailable ? 'background' : undefined
      };

      if ('price' in reservation) {
        formattedEvent.title = reservation.price.toString() + '€';
      }

      formattedEvents.push(formattedEvent);

    });
    this.events.update(currentEvents => [...currentEvents, ...formattedEvents]);
  }

  createAvailableReservation(info: any) {

    const modalRef = this.modalService.open(ModalProgramComponent);
    modalRef.componentInstance.title = 'Create available reservation?';
    modalRef.componentInstance.start = info.start;
    modalRef.componentInstance.end = info.end;
    modalRef.closed.subscribe((res) => {
      if (res.reason === 'confirmed') {

        const availableReservation: AvailableReservation = {
          date_time_start: info.start,
          date_time_end: info.end,
          field_id: this.field.id!,
          price: Number(parseFloat(res.price).toFixed(2))
        }

        this.availableReservationService.createAvailableReservation(availableReservation).subscribe({
          next: (result) => {
            this.reservationsToEvents([result], true);
          }
        })
      }
    })
  }

}

