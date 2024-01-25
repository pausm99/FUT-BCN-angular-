import { Component } from '@angular/core';
import { FieldService } from '../../../services/field/field.service';
import { UserService } from '../../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFieldComponent } from '../add-field/add-field.component';

const maxStars: number = 5;


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FilterComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  public fields = this.fieldService.fields;
  public stars: any[] = new Array(maxStars);

  public company: string | null = this.route.snapshot.queryParamMap.get('company');

  constructor(
    private fieldService: FieldService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NgbModal) {}

  ngOnInit(): void {
    if (this.company) {
      const company_id = this.userService.userInfo().id;
      this.fieldService.setFieldSignalByType(company_id);
    } else {
      this.fieldService.setFieldSignalByType(null);
    }
  }

  goToField(id: number) {
    this.router.navigate([`/fields/${id}`]);
  }

  manageField(id: number) {
    this.router.navigate([`/manage/field/${id}`]);
  }

  addNewField() {
    this.modal.open(AddFieldComponent);
  }

}
