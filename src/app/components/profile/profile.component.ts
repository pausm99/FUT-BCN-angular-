import { User } from './../../interfaces/user';
import { Component, signal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user = signal<User>({
    email: '',
    password: '',
    name: '',
    role: ''
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
  ) {
    const id = this.userService.userInfo().id;
    userService.getUserById(id).subscribe({
      next: (res) => this.user.set(res)
    });
  }

  getPosition(): string {
    const position = this.user().position;

    switch (position) {
      case 'GK':
        return 'Goalkeeper';
      case 'DF':
        return 'Defender';
      case 'MD':
        return 'Midfielder';
      case 'FW':
        return 'Forward';
      default:
        return 'No info'
    }
  }

  isCompany(): boolean {
    return this.user().role === 'company';
  }

  logout() {
    this.router.navigate(['/home']);
    this.authService.logOut();
    this.userService.userInfo.set({
      id: 0,
      email: '',
      name: '',
      role: ''
    });
  }

}
