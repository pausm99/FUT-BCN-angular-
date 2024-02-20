import { CommonModule, DatePipe, KeyValue } from '@angular/common';
import { AvailableReservation } from '../../../interfaces/available-reservation';
import { AvailableReservationsService } from './../../../services/availableReservations/available-reservations.service';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReservationComponent } from '../modal-reservation/modal-reservation.component';
import { Field } from '../../../interfaces/field';
import { PaymentComponent } from '../../payment/payment.component';
import { FieldService } from '../../../services/field/field.service';
import { ToastService } from '../../../services/toast/toast.service';


@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss'
})
export class AvailabilityComponent implements OnInit {

  public modalService = inject(NgbModal);

  public reservationsPerField: Record<number, AvailableReservation[]> = {};

  public today!: string;

  private todaySubject = new Subject<string>();
  todayObservable$: Observable<string> = this.todaySubject.asObservable();


  constructor(
    private availableResService: AvailableReservationsService,
    private fieldService: FieldService,
    private toastService: ToastService,
    private router: Router,
    private ngZone: NgZone) {

    const today = new Date();
    const now = today.toString();
    const end = new Date(today.setHours(23, 59, 59, 999)).toString();

    this.today = today.toLocaleDateString();

    this.getAvailableReservationsForToday(now, end);

  }

  ngOnInit(): void {
    this.todayObservable$.pipe(
      tap({
        next: () => this.changedToday()
      })
    ).subscribe();
  }

  getAvailableReservationsForToday(now: string, end: string) {
    this.availableResService.getAvailableReservationByTimeRange(now, end).subscribe({
      next: (res) => {
        this.classifyAvailableReservations(res);
        console.log(res);
      },
      error: () => this.toastService.showDanger(`Failed to load available reservations for selected date`)
    })
  }

  itHasAnyRecords(): boolean {
    return Object.keys(this.reservationsPerField).length > 0;
  }


  classifyAvailableReservations(avRes: AvailableReservation[]) {
    this.reservationsPerField = {}

    avRes.forEach(res => {
      const { field_id } = res;

      if (!this.reservationsPerField[field_id]) {
        this.reservationsPerField[field_id] = []
      }

      this.reservationsPerField[field_id].push(res);
    })
  }

  isToday(): boolean {
      const todayTime = new Date().toLocaleDateString();
    return todayTime === this.today;
  }

  nextDay(): void {

    const todayDate = this.getDateFromTodayString();
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);

    this.updateToday(tomorrowDate.toLocaleDateString());

  }

  getNameByKey(key: string) {
    return this.reservationsPerField[Number(key)][0].field_name;
  }

  getFieldTypeByKey(key: string) {
    return this.reservationsPerField[Number(key)][0].field_type;
  }

  previousDay() {
    const todayDate = this.getDateFromTodayString()
    const yesterDayDate = new Date(todayDate);
    yesterDayDate.setDate(todayDate.getDate() - 1);

    this.updateToday(yesterDayDate.toLocaleDateString());
  }

  getDateFromTodayString(): Date {

    const [day, month, year] = this.today.split("/");

    return new Date(`${year}-${month}-${day}`);
  }

  changedToday() {
    var date: Date;
    var start = '';
    if (!this.isToday()) {
      date = this.getDateFromTodayString();
      start = date.toString()
    } else {
      date = new Date();
      start = date.toString();
    }
    const end = new Date(date.setHours(23, 59, 59, 999)).toString();

    this.getAvailableReservationsForToday(start, end);
  }

  updateToday(newDate: string) {
    this.today = newDate;
    this.todaySubject.next(newDate);
  }

  bookField(fieldId: string, res: AvailableReservation) {
    const auxField: Field = {
      id: Number(fieldId),
      company_id: 0,
      name: this.getNameByKey(fieldId)!,
      type: '',
      location_lat: 0,
      location_lng: 0,
      address: '',
      public: false,
      width: 0,
      length: 0,
      opening_time: '',
      closing_time: ''
    }


    const start = res.date_time_start;
    const end = res.date_time_end;

    const modalRef = this.modalService.open(ModalReservationComponent);
    modalRef.componentInstance.field = auxField;
    modalRef.componentInstance.start = start;
    modalRef.componentInstance.end = end;

    modalRef.closed.subscribe((result) => {
      if (result.reason === 'confirmed') {

        this.fieldService.activeField.set(auxField);

        this.changeAvailableResBlockState(res.id!, true);

        this.modalService.dismissAll();

        res.blocked = true;

        const paymentModalRef = this.modalService.open(PaymentComponent);
        paymentModalRef.componentInstance.avResInfo = res;


        paymentModalRef.closed.subscribe((result) => {
          if (result.reason === 'cancelled') {

            this.changeAvailableResBlockState(res.id!, false)

          } else if (result.reason === 'approved') {

            this.ngZone.run(() => {
              this.router.navigate(['/profile/my-reservations']);
            });
          }
        });

      }
    })
  }

  changeAvailableResBlockState(id: number, state: boolean) {
    this.availableResService.changeAvailableReservationState(id, state).subscribe((res) => console.log(res))
  }
}
