import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TitleService } from '../../../services/title/title.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  activeModal = inject(NgbActiveModal);
  public title!: string;

  constructor(private titleService: TitleService) {
    this.title = this.titleService.getPageTitle();
  }

}
