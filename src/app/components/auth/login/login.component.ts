import { TitleService } from './../../../services/title/title.service';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  activeModal = inject(NgbActiveModal);
  public title!: string;

  constructor(private titleService: TitleService) {
    this.title = this.titleService.getPageTitle();
  }

  logIn() {
    if (this.loginForm.valid) alert();
  }

}
