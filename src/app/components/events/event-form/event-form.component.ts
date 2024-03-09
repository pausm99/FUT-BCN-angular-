import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDatepickerModule, NgbTimeAdapter, NgbTimepicker, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from '../../../validators/custom.validator';
import { CommonModule, DatePipe } from '@angular/common';
import { Reservation } from '../../../interfaces/reservation';
import { UserService } from '../../../services/user/user.service';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { NgbDateStringAdapter } from '../../../adapters/ngb-date-string.adapter';
import { NgbTimeStringAdapter } from '../../../adapters/ngb-time-string.adapter';
import { EventService } from '../../../services/event/event.service';
import { Event } from '../../../interfaces/event';
import { FieldService } from '../../../services/field/field.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgbTimepicker, CommonModule, NgbTooltipModule, NgbDatepickerModule, DatePipe],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
	providers: [
    { provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter },
    { provide: NgbDateAdapter, useClass: NgbDateStringAdapter }
  ],
})
export class EventFormComponent  implements OnInit {

  activeModal = inject(NgbActiveModal);

  public field_id: number = this.fieldService.activeField().id!;

  constructor(
    private userService: UserService,
    private reservationService: ReservationService,
    private eventService: EventService,
    private fieldService: FieldService,
    private router: Router,
  ) {}

  eventForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    incomplete: new FormControl(false),
    date: new FormControl('', [Validators.required]),
    start_time: new FormControl('', [Validators.required]),
    end_time: new FormControl('', [Validators.required]),
    max_players: new FormControl(null)
  }, [CustomValidators.timeRangeValidator]);

  ngOnInit(): void {
    const incomplete = this.eventForm.get('incomplete');
    const max_players = this.eventForm.get('max_players');

    if (incomplete && max_players) {

      this.eventForm.get('incomplete')?.valueChanges.subscribe((value) => {
        if (value) {
          max_players.setValidators([Validators.required, Validators.min(1), Validators.max(200)]);
        } else {
          max_players.clearValidators();
        }
        max_players.updateValueAndValidity();
      });
    }
  }



  createEvent() {
    if (this.eventForm.valid) {

      const date: string = this.getFormattedDate(new Date(this.eventForm.get('date')?.value!));

      const reservation: Reservation = {
        user_id: this.userService.userInfo().id,
        field_id: this.field_id,
        date_time_start: this.getFormattedTime(date, this.eventForm.get('start_time')?.value!),
        date_time_end: this.getFormattedTime(date, this.eventForm.get('end_time')?.value!),
        amount: 0,
        paid: false
      }

      this.reservationService.createReservation(reservation).subscribe({
        next: (createdReservation) => {
          this.newEvent(createdReservation);
        }
      })

    }
  }

  getFormattedTime(date: string, time: string) {

    const combinedDateTimeString = `${date}T${time}`;
    const formattedDate = new Date(combinedDateTimeString);

    return formattedDate;

  }

  getFormattedDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  newEvent(reservation: Reservation) {
    const incomplete = this.eventForm.get('incomplete')?.value!;

    const event: Event = {
      name: this.eventForm.get('name')?.value!,
      reservation_id: reservation.id!,
      field_id: this.field_id,
      user_id: reservation.user_id,
      date_time_start: reservation.date_time_start,
      date_time_end: reservation.date_time_end,
      incomplete: incomplete,
      max_players: incomplete ? this.eventForm.get('max_players')?.value! : undefined
    }

    this.eventService.createEvent(event);
    this.router.navigate(['/events'])
    this.activeModal.close();
  }

  closeModalAndRedirect() {
    this.router.navigate(['/events'])
    this.activeModal.close();
  }

}
