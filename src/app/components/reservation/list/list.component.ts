import { UserService } from './../../../services/user/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { FieldService } from '../../../services/field/field.service';

const maxStars: number = 5;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  public fields = this.fieldService.fields;
  public stars: any[] = new Array(maxStars);

  @Input() company: boolean = false;

  constructor(private fieldService: FieldService, private userService: UserService) {}

  ngOnInit(): void {
    if (this.company) {
      const company_id = this.userService.userInfo().id;
      this.fieldService.setFieldSignalByType(company_id);
    } else {
      this.fieldService.setFieldSignalByType(null);
    }
  }

}
