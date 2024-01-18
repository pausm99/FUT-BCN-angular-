import { Component, Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbTimeAdapter, NgbTimeStruct, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { MapComponent } from './map/map.component';
import { LngLat } from 'mapbox-gl';
import { RouterLink } from '@angular/router';
import { CustomValidators } from '../../../validators/custom.validator';
import { FieldService } from '../../../services/field/field.service';
import { Field } from '../../../interfaces/field';
import { UserService } from '../../../services/user/user.service';

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
  selector: 'app-add-field',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgbTimepicker],
  templateUrl: './add-field.component.html',
  styleUrl: './add-field.component.scss',
	providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }],
})
export class AddFieldComponent {

  activeModal = inject(NgbActiveModal);

  public coordinates?: LngLat;

  fieldForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    width: new FormControl(null, [Validators.required]),
    length: new FormControl(null, [Validators.required]),
    opening_time: new FormControl(null, [Validators.required]),
    closing_time: new FormControl(null, [Validators.required]),
  }, [CustomValidators.timeRangeValidator]);

  constructor(private modal: NgbModal, private fieldService: FieldService, private userService: UserService) {}

  openMap() {
    console.log(this.coordinates);
    const modal = this.modal.open(MapComponent);
    modal.closed.subscribe({
      next: (res) => {
        console.log(res);
        this.coordinates = res.coordinates;
      }
    })
  }

  async addField() {
    if (this.fieldForm.valid || this.coordinates !== undefined) {

      const controls = this.fieldForm.controls;

      let field: Field = {
        company_id: this.userService.userInfo().id,
        name: controls.name.value!,
        type: controls.type.value!,
        location_lat: this.coordinates?.lat!,
        location_lng: this.coordinates?.lng!,
        address: controls.address.value!,
        public: false,
        width: controls.width.value!,
        length: controls.length.value!,
        opening_time: controls.opening_time.value!,
        closing_time: controls.closing_time.value!
      }

      console.log(field)

      this.fieldService.createNewField(field).subscribe({
        next: (result) => {
          this.fieldService.fields.update(items => [...items, result]);
          this.activeModal.close();
        }
      })

    }
    else {

    }
  }
}
