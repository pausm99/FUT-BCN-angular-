import { UserService } from './../../../services/user/user.service';
import { Component } from '@angular/core';
import { EventService } from '../../../services/event/event.service';
import { Event } from '../../../interfaces/event';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [DatePipe, NgbTooltip],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.scss'
})
export class EventInfoComponent {

  public event!: Event;
  public players?: number;
  public joined?: boolean = false;

  private user_id = this.userService.userInfo().id;

  constructor(
    private eventService: EventService,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService) {
    this.event = this.eventService.activeEvent();
    if (this.event.id !== 0) {
      this.eventService.getPlayersEnrolled(this.event.id!, this.user_id).subscribe({
        next: (result: any) => {
          this.players = Number(result.player_count);
          this.joined = result.user_exists;
        },
        error: () => this.toastService.showDanger('Failed to load players enrolled to this event')
      })
    }
  }

  goToField(id: number) {
    this.router.navigate([`/fields/${id}`]);
  }

  joinEvent() {
    if (!this.joined) {
      if (this.event.id !== 0) {
        this.eventService.joinEvent(this.event.id!, this.user_id).subscribe({
          next: () => {
            this.joined = true;
            this.players!++;
          }
        })
      }
    }
  }

}
