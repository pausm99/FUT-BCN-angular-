import { Reservation } from '../../../interfaces/reservation';
import { Component, NgZone, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { FieldService } from '../../../services/field/field.service';
import { Field } from '../../../interfaces/field';
import { AvailableReservationsService } from '../../../services/availableReservations/available-reservations.service';
import { AvailableReservation } from '../../../interfaces/available-reservation';
import moment from 'moment-timezone';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReservationComponent } from '../modal-reservation/modal-reservation.component';
import { PaymentComponent } from '../../payment/payment.component';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast/toast.service';


@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './reservation-field.component.html',
  styleUrl: './reservation-field.component.scss'
})
export class ReservationFieldComponent implements OnInit, OnDestroy {

  public events = signal<EventInput[]>([]);

  public modalService = inject(NgbModal);

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
    eventClick: (info) => {
      this.handleEventClick(info);
    }
  };

  constructor(
    private fieldService: FieldService,
    private availableReservationsService: AvailableReservationsService,
    private toastService: ToastService,
    private router: Router,
    private ngZone: NgZone) {

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
      let isBlocked = false;

      if (isAvailable && 'blocked' in reservation) {
        isBlocked = reservation.blocked!;
      }

      if (moment(reservation.date_time_start).format() > now && !isBlocked) {

        const formattedEvent: EventInput = {
          id: (!isAvailable ? 'res' : 'avRes') + reservation.id,
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
      },
      error: () => {
        this.toastService.showDanger(`Failed to load field reservations`)
      }
    })
  }

  handleEventClick(info: EventClickArg) {
    const id = info.event._def.publicId;
    const isAvailable = id.includes('avRes');

    if (isAvailable) {

      const avResId = Number(id?.split('avRes')[1]);

      const start = info.event.start;
      const end = info.event.end;

      const modalRef = this.modalService.open(ModalReservationComponent);
      modalRef.componentInstance.field = this.field;
      modalRef.componentInstance.start = start;
      modalRef.componentInstance.end = end;

      modalRef.closed.subscribe((res) => {
        if (res.reason === 'confirmed') {

          this.changeAvailableResBlockState(avResId, true);

          this.modalService.dismissAll();


          let found = this.events().find(item => item.id === id)
          if (found) {

            const avRes: AvailableReservation = {
              id: avResId,
              date_time_start: new Date(found.start!.toLocaleString()),
              date_time_end: new Date(found.end!.toLocaleString()),
              field_id: this.field?.id!,
              price: Number(found.title?.split('€')[0]),
              blocked: true
            }

            const paymentModalRef = this.modalService.open(PaymentComponent);
            paymentModalRef.componentInstance.avResInfo = avRes;

            paymentModalRef.closed.subscribe((res) => {
              if (res.reason === 'cancelled') {
                this.changeAvailableResBlockState(avResId, false)
              } else if (res.reason === 'approved') {
                this.ngZone.run(() => {
                  this.router.navigate(['/profile/my-reservations']);
                });
              }
            })
          }
        }
      })
    }
  }

  changeAvailableResBlockState(id: number, state: boolean) {
    this.availableReservationsService.changeAvailableReservationState(id, state).subscribe((res) => console.log(res))
  }

}
