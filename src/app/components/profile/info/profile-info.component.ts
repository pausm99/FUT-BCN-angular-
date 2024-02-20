import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent {

  user = signal<User>({
    email: '',
    password: '',
    name: '',
    role: ''
  });

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
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
