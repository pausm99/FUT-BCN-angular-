import { AfterViewInit, Component } from '@angular/core';
import { FieldService } from '../../../services/field/field.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Field } from '../../../interfaces/field';
import { InfoComponent } from '../info/info.component';


@Component({
  selector: 'app-manage-field',
  standalone: true,
  imports: [InfoComponent],
  templateUrl: './manage-field.component.html',
  styleUrl: './manage-field.component.scss'
})
export class ManageFieldComponent {

  public field?: Field;

  constructor(private fieldService: FieldService, private route: ActivatedRoute, private router: Router) {
    var snapshot = this.route.snapshot;
    const id: string = snapshot.params['id'];

    this.fieldService.getFieldById(Number(id)).subscribe({
      next: (responseField) => {
        this.field = responseField;
      }
    });
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

}
