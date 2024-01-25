import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFieldComponent } from '../fields/add-field/add-field.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent {

  constructor(private modal: NgbModal) {}

  addNewField() {
    this.modal.open(AddFieldComponent);
  }

}
