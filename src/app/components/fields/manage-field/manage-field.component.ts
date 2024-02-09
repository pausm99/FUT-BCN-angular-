import { Component, inject } from '@angular/core';
import { FieldService } from '../../../services/field/field.service';
import { Router, RouterOutlet } from '@angular/router';
import { Field } from '../../../interfaces/field';
import { ProgramComponent } from '../../reservation/program/program.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-manage-field',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './manage-field.component.html',
  styleUrl: './manage-field.component.scss'
})
export class ManageFieldComponent {

  public field?: Field;

  public program: boolean = false;

  private modalService = inject(NgbModal);

  constructor(
    private fieldService: FieldService,
    private router: Router,
    ) {

    this.field = this.fieldService.activeField();
  }

  deleteField() {
    if (this.field?.id) {
      this.fieldService.deleteField(this.field?.id).subscribe({
        next: () => {
          this.router.navigate(['/manage'], { queryParams: { company: true } });
        },
        error: () => {
          alert("Can't delete this football field"); //posar un alert de bootstrap
        }
      });
    }
    else alert("Can't delete this football field"); //posar un alert de bootstrap
  }

  editField() {

  }

  editAvailability() {
    this.router.navigate([`manage/field/${this.field?.id}/schedule`])
  }

}
