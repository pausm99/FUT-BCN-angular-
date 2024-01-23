import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ListComponent, RouterOutlet, RouterLink],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {

}
