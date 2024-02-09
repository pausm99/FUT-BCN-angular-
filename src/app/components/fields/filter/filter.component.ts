import { Component, EventEmitter, Injectable, OnInit, Output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbTimeAdapter, NgbTimeStruct, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '../../../interfaces/filter';

const pad = (i: number): string => (i < 10 ? `0${i}` : `${i}`);

/**
 * String Time adapter
 */
@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {
	fromModel(value: string | null): NgbTimeStruct | null {
		if (!value) {
			return null;
		}
		const split = value.split(':');
		return {
			hour: parseInt(split[0], 10),
			minute: parseInt(split[1], 10),
			second: parseInt(split[2], 10),
		};
	}

	toModel(time: NgbTimeStruct | null): string | null {
		return time != null ? `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}` : null;
	}
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [RouterLink, NgbTimepicker, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }],
})
export class FilterComponent implements OnInit {

  @Output() sendFilters = new EventEmitter<Filter>();

  public activeFilters = signal<number>(0);

  filterForm = new FormGroup({
    name: new FormControl(null),
    type: new FormGroup({
      FutSala: new FormControl(false),
      Fut5: new FormControl(false),
      Fut7: new FormControl(false),
      Fut11: new FormControl(false)
    }),
    property: new FormGroup({
      private: new FormControl(false),
      public: new FormControl(false)
    }),
    opening_time: new FormControl(null),
    closing_time: new FormControl(null),
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => this.getActiveFields())
  }

  applyFilters() {
    const controls = this.filterForm.controls;

    const filter: Filter = {
      name: controls.name.value!,
      FutSala: controls.type.controls.FutSala.value!,
      Fut5: controls.type.controls.Fut5.value!,
      Fut7: controls.type.controls.Fut7.value!,
      Fut11: controls.type.controls.Fut11.value!,
      property: {
        private: controls.property.controls.private.value!,
        public: controls.property.controls.public.value!
      },
      opening_time: controls.opening_time.value!,
      closing_time: controls.closing_time.value!,
    }

    this.sendFilters.emit(filter);
  }

  resetFilter() {
    this.filterForm.reset();
    this.sendFilters.emit();
  }

  getActiveFields() {
    let activeFields = 0;

    Object.values(this.filterForm.controls).forEach(control => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(subControl => {
          if (subControl.value === true) {
            activeFields++;
          }
        });
      } else {
        if (this.isActive(control)) {
          activeFields++;
        }
      }
    });

    this.activeFilters.set(activeFields);
  }

  private isActive(control: AbstractControl): boolean {
    return control.value === true || (typeof control.value === 'string' && control.value.trim() !== '');
  }
}
