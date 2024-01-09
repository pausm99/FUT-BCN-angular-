import { Component, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TitleService } from '../../../services/title/title.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  activeModal = inject(NgbActiveModal);
  public title!: string;

  public company: boolean = false;

  registerForm = new FormGroup({
  })

  constructor(private titleService: TitleService) {
    this.title = this.titleService.getPageTitle();
  }

  ngOnInit(): void {

  }

  changeTypeUser(): void {
    this.company = true;
  }

}
