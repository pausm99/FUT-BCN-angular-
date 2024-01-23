import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ListComponent } from '../reservation/list/list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFieldComponent } from './add-field/add-field.component';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent {

  public isCompany: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private modal: NgbModal
  ) {}

  addNewField() {
    this.modal.open(AddFieldComponent);
  }

}
