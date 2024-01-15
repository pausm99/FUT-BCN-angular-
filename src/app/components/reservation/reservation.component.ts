import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {

  public paddingTop!: string;
  @ViewChild('reservationSection') reservationSection?: ElementRef;

  constructor(private navbarService: NavbarService, private cd: ChangeDetectorRef) {}

  ngAfterViewChecked(): void {
    let heroElement = this.reservationSection?.nativeElement;
    const styles = window.getComputedStyle(heroElement);
    const paddingBottom = Number(styles.paddingBottom.split('px')[0]);
    const paddingTop = paddingBottom + this.navbarService.getHeight();
    this.paddingTop = paddingTop + 'px !important';
    this.cd.detectChanges();
  }

}
