import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { ReservationService } from '../../../services/reservation/reservation.service';
import { Reservation } from '../../../interfaces/reservation';
import { FieldService } from '../../../services/field/field.service';
import { Field } from '../../../interfaces/field';
import { ActivatedRoute } from '@angular/router';
import { AvailableReservationsService } from '../../../services/availableReservations/available-reservations.service';
import { AvailableReservation } from '../../../interfaces/available-reservation';


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

  public events: any = [];

  public field?: Field;

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
    private route: ActivatedRoute,
    private availableReservationsService: AvailableReservationsService
    ) {

      var snapshot = this.route.snapshot;
      const fieldId: number = Number(snapshot.params['id']);

      this.reservationService.getReservationsByFieldId(fieldId);

      this.availableReservationsService.getAvailableReservationsByFieldId(fieldId);

      effect(() => {
        this.reservations = this.reservationsSignal();
        this.reservations.forEach(reservation => this.reservationsToEvents(reservation));

        this.fieldService.getFieldById(fieldId).subscribe({
          next: (res) => {
            this.calendarOptions.slotMinTime = res.opening_time;
            this.calendarOptions.slotMaxTime = res.closing_time;
            this.field = res;
            this.initCalendar();
          }
        })
      });

      effect(() => {
        this.availableReservations = this.availableReservationsSignal();
        this.availableReservations.forEach(availableRes => this.availableReservationsToEvents(availableRes));
      })
  }

  ngOnInit(): void {
      this.interval = setInterval(() => {
        this.checkExpiredEvents();
      }, 60000)
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  reservationsToEvents(reservation: Reservation) {

    const now = new Date().toISOString();

    if (reservation.date_time_start.toString() > now) {
      const formattedEvent = {
        start: reservation.date_time_start,
        end: reservation.date_time_end,
        color: 'red',
        display: 'background'
      };

      this.events.push(formattedEvent);
    }

  }


  availableReservationsToEvents(availableRes: AvailableReservation) {

    const now = new Date().toISOString();


    if (availableRes.date_time_start.toString() > now) {

      const formattedEvent = {
        start: availableRes.date_time_start,
        end: availableRes.date_time_end,
        title: availableRes.price + '€',
        color: '#265529',
      }

      this.events.push(formattedEvent);

    }

  }


  initCalendar() {
    this.calendarOptions.events = this.events;

    new Calendar(document.getElementById('calendar')!, this.calendarOptions).render();
  }

  checkExpiredEvents() {
    const now = new Date().toISOString();

    const filteredEvents: any[] = this.events.filter((event: EventInput) => event.start! > now);

    if (filteredEvents.length != this.events.length) {
      this.events = filteredEvents;
      this.initCalendar();
    }
  }

}
