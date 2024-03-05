import { Component, Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbTimeAdapter, NgbTimeStruct, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { LngLat } from 'mapbox-gl';
import { RouterLink } from '@angular/router';
import { CustomValidators } from '../../../validators/custom.validator';
import { FieldService } from '../../../services/field/field.service';
import { Field } from '../../../interfaces/field';
import { UserService } from '../../../services/user/user.service';
import { MapPointerComponent } from '../../map/map-pointer/map-pointer.component';
import { ToastService } from '../../../services/toast/toast.service';
import { NgbTimeStringAdapter } from '../../../adapters/ngb-time-string.adapter';


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

  constructor(
    private modal: NgbModal,
    private fieldService: FieldService,
    private userService: UserService,
    private toastService: ToastService) {}

  openMap() {
    const modal = this.modal.open(MapPointerComponent);
    modal.closed.subscribe({
      next: (res) => {
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
        closing_time: controls.closing_time.value!,
      }


      this.fieldService.createNewField(field).subscribe({
        next: (result) => {
          this.toastService.showSuccess('Field created successfully')
          this.fieldService.fields.update(items => [...items, result]);
          this.activeModal.close();
        },
        error: () => this.toastService.showDanger('Failed to create a new field')
      })

    }
    else {

    }
  }
}
