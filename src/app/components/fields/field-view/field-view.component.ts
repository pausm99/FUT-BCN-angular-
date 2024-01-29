import { Component } from '@angular/core';
import { InfoComponent } from '../info/info.component';
import { Field } from '../../../interfaces/field';
import { FieldService } from '../../../services/field/field.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-field-view',
  standalone: true,
  imports: [InfoComponent],
  templateUrl: './field-view.component.html',
  styleUrl: './field-view.component.scss'
})
export class FieldViewComponent {

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

}
