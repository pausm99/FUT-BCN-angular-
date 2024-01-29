import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ReservationService } from '../../../services/reservation/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin],
    themeSystem: 'bootstrap5',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay' // user can switch between the two
    }
  };

  constructor(private reservationService: ReservationService) {}

}
