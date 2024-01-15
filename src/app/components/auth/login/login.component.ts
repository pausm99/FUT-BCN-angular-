import { TitleService } from './../../../services/title/title.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(256)]),
    password: new FormControl('', [Validators.required])
  })

  activeModal = inject(NgbActiveModal);
  public title!: string;

  invalidCredentials: boolean = false;
  serverError: boolean = false;

  constructor(
    private titleService: TitleService,
    private navbarService: NavbarService,
    private usersService: UserService) {
    this.title = this.titleService.getPageTitle();
  }

  logIn() {
    if (this.loginForm.valid) {
      const controls = this.loginForm.controls;
      const body = {
        email: controls.email.value,
        password: controls.password.value
      }
      this.usersService.login(body).subscribe({
        next: () => {
          this.activeModal.close();
        },
        error: (err) => {
          if (err.status === 401) this.invalidCredentials = true;
          else {
            console.log(err);
            this.serverError = true;
          }
        }
      })
    }
  }

  openRegister(): void {
    this.activeModal.close();
    this.navbarService.openModal('register');
  }

}
