import { TitleService } from './../../../services/title/title.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  public title!: string;

  constructor(private titleService: TitleService) {
    this.title = this.titleService.getPageTitle();
  }

}
