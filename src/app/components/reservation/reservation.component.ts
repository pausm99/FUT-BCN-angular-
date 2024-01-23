import { NavbarService } from './../../services/navbar/navbar.service';
import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ListComponent, RouterOutlet],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {

}
