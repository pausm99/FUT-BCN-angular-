import { Component } from '@angular/core';
import { InfoComponent } from '../info/info.component';
import { Field } from '../../../interfaces/field';
import { FieldService } from '../../../services/field/field.service';

@Component({
  selector: 'app-field-view',
  standalone: true,
  imports: [InfoComponent],
  templateUrl: './field-view.component.html',
  styleUrl: './field-view.component.scss'
})
export class FieldViewComponent {

  public field?: Field;

  constructor(private fieldService: FieldService) {
    this.field = this.fieldService.activeField()
  }

}
