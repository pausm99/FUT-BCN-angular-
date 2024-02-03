import { Reservation } from './../../../interfaces/reservation';
import { Component, OnDestroy, OnInit, effect, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { ReservationService } from '../../../services/reservation/reservation.service';
import { FieldService } from '../../../services/field/field.service';
import { Field } from '../../../interfaces/field';
import { AvailableReservationsService } from '../../../services/availableReservations/available-reservations.service';
import { AvailableReservation } from '../../../interfaces/available-reservation';
import { Subscription } from 'rxjs';
import moment from 'moment-timezone';


@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit, OnDestroy {

  public reservationsSignal = this.reservationService.reservations;
  public reservations: Reservation[] = [];

  public availableReservationsSignal = this.availableReservationsService.availableReservations;
  public availableReservations: AvailableReservation[] = [];

  public events = signal<EventInput[]>([]);

  public field?: Field;

  private routeSubscription!: Subscription;

  private interval: any;

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin, interactionPlugin],
    themeSystem: 'bootstrap5',
    firstDay: 1,
    locale: 'es',
    nowIndicator: true,
    headerToolbar: {
      left: 'today',
      right: 'prev,next',
      center: 'title',
    },
    eventMaxStack: 1,
    height: 'auto',
  };


  constructor(
    private reservationService: ReservationService,
    private fieldService: FieldService,
    private availableReservationsService: AvailableReservationsService
    ) {

      this.field = this.fieldService.activeField();

      this.calendarOptions.slotMinTime = this.field.opening_time;
      this.calendarOptions.slotMaxTime = this.field.closing_time;

      this.reservationService.getReservationsByFieldId(this.field.id!);
      this.availableReservationsService.getAvailableReservationsByFieldId(this.field.id!);

      effect(() => {
        this.reservations = this.reservationsSignal();
        this.reservationsToEvents(this.reservations, false);
      }, { allowSignalWrites: true });

      effect(() => {
        this.availableReservations = this.availableReservationsSignal();
        this.reservationsToEvents(this.availableReservations, true);
      }, { allowSignalWrites: true });

  }

  ngOnInit(): void {
      this.interval = setInterval(() => {
        this.checkExpiredEvents();
      }, 60000)
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.routeSubscription.unsubscribe();
  }

  reservationsToEvents(reservations: Reservation[] | AvailableReservation[], isAvailable: boolean) {

    const now = moment(new Date()).format();
    let formattedEvents: EventInput[] = [];

    reservations.forEach(reservation => {

      if (moment(reservation.date_time_start).format() > now) {

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
      }
    });
    if (formattedEvents.length > 0) this.events.update(currentEvents => [...currentEvents, ...formattedEvents]);
  }



  checkExpiredEvents() {
    const now = moment(new Date()).format();
    const filteredEvents: any[] = this.events().filter((event: EventInput) => event.start! > now);

    if (filteredEvents.length != this.events.length) {
      this.events.set( filteredEvents);
    }
  }

}
