import { Component } from '@angular/core';
import { FieldService } from '../../../services/field/field.service';
import { Router, RouterOutlet } from '@angular/router';
import { Field } from '../../../interfaces/field';
import { ToastService } from '../../../services/toast/toast.service';


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

  constructor(
    private fieldService: FieldService,
    private router: Router,
    private toastService: ToastService
    ) {

    this.field = this.fieldService.activeField();
  }

  deleteField() {
    if (this.field?.id) {
      this.fieldService.deleteField(this.field?.id).subscribe({
        next: () => {
          this.router.navigate(['/manage'], { queryParams: { company: true } });
          this.toastService.showSuccess(`Field deleted successfully`);
        },
        error: () => {
          this.toastService.showDanger(`Can't delete this field`);
        }
      });

    }
    else this.toastService.showDanger(`Can't delete this field`);

  }

  editField() {

  }

  editAvailability() {
    this.router.navigate([`manage/field/${this.field?.id}/schedule`])
  }

}
