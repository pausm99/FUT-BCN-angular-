import { Component } from '@angular/core';
import { FieldService } from '../../../services/field/field.service';
import { UserService } from '../../../services/user/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFieldComponent } from '../add-field/add-field.component';
import { Filter } from '../../../interfaces/filter';
import { Field } from '../../../interfaces/field';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FilterComponent, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  public fields = this.fieldService.fields;

  public private: boolean = false;

  public company: string | null = this.route.snapshot.queryParamMap.get('company');

  public filter?: Filter;

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

  bookField(id: number) {
    this.router.navigate([`/reservations/${id}`]);
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

  applyFilters(filters: Filter) {
    console.log(filters);
    this.filter = filters;
  }


  fieldMatchesCriteria(field: Field): boolean {
    if (this.filter === undefined) return true;
    else {


      if (this.filter.name) {
        if (field.name.toLowerCase().includes(this.filter.name.toLowerCase())) return true;
        else return false;
      }

      if (
        (this.filter.FutSala && field.type === 'FutSala') ||
        (this.filter.Fut5 && field.type === 'Fut5') ||
        (this.filter.Fut7 && field.type === 'Fut7') ||
        (this.filter.Fut11 && field.type === 'Fut11')
      ) {
      } else {
        if (this.filter.FutSala || this.filter.Fut5 || this.filter.Fut7 || this.filter.Fut11)
        return false;
      }

      if (
        (this.filter.property.public && !field.public) ||
        (this.filter.property.private && field.public)
      ) return false;

      if (
        this.filter.opening_time &&
        field.opening_time &&
        this.filterDateIsAfter(this.filter.opening_time, field.opening_time)
      ) {
        return false
      }


      if (
        this.filter.closing_time &&
        field.closing_time &&
        !this.filterDateIsAfter(this.filter.closing_time, field.closing_time)
      ) return false


      return true;
    }
  }

  filterDateIsAfter(dateFilterString: string, dateFieldString: string): boolean {
    const actualDate = new Date().toISOString().split('T')[0];

    const dateFilter = new Date(`${actualDate}T${dateFilterString}`);
    const dateField = new Date(`${actualDate}T${dateFieldString}`);

    return dateFilter > dateField;
  }

}
