import { Component } from '@angular/core';
import { FieldService } from '../../../services/field.service';
import { Field } from '../../../interfaces/field';

const maxStars: number = 5;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  public fields: Field[] = [];
  public stars: any[] = new Array(maxStars);

  constructor(private fieldService: FieldService) {
    this.fieldService.getAllFields().subscribe((res) => {
      this.fields = res;
    });
  }
}
