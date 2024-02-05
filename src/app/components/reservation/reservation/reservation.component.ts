import { Reservation } from './../../../interfaces/reservation';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { FieldService } from '../../../services/field/field.service';
import { Field } from '../../../interfaces/field';
import { AvailableReservationsService } from '../../../services/availableReservations/available-reservations.service';
import { AvailableReservation } from '../../../interfaces/available-reservation';
import moment from 'moment-timezone';


@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit, OnDestroy {

  public events = signal<EventInput[]>([]);

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
    datesSet: (dates) => {
      this.getDataFromDateRange(dates);
    },
  };

  constructor(
    private fieldService: FieldService,
    private availableReservationsService: AvailableReservationsService,
    ) {

      this.field = this.fieldService.activeField();

      this.calendarOptions.slotMinTime = this.field.opening_time;
      this.calendarOptions.slotMaxTime = this.field.closing_time;

      this.initialCalendarViewSize();
  }

  ngOnInit(): void {

    this.interval = setInterval(() => {
      this.checkExpiredEvents();
    }, 60000)

  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  reservationsToEvents(reservations: (AvailableReservation | Reservation)[]) {

    const now = moment(new Date()).format();

    let formattedEvents: EventInput[] = [];

    reservations.forEach(reservation => {

      const isAvailable = reservation.type === 'available';

      if (moment(reservation.date_time_start).format() > now) {

        const formattedEvent: EventInput = {
          start: reservation.date_time_start,
          end: reservation.date_time_end,
          color: !isAvailable ? 'red' : 'green',
          display: isAvailable ? undefined : 'background'
        };

        if (isAvailable) {
          const availableReservation = reservation as AvailableReservation;
          formattedEvent.title = availableReservation.price.toString() + '€';
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


  initialCalendarViewSize() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) this.calendarOptions.initialView = 'timeGridDay';
  }

  getDataFromDateRange(dates: DatesSetArg) {
    this.events.set([]);
    this.availableReservationsService.getAllTypeByFieldAndTimeRange(this.field?.id!, dates.startStr.split('T')[0], dates.endStr.split('T')[0]).subscribe({
      next: (res) => {
        this.reservationsToEvents(res);
      }
    })
  }

}
