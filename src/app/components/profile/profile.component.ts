import { User } from './../../interfaces/user';
import { Component, signal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
