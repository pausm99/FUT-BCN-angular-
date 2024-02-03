import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface dateStruct {
  date: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalProgramComponent implements OnInit {

  @Input() title!: string;
  @Input() start!: string;
  @Input() end!: string;

  price = new FormControl(null, [Validators.required, Validators.min(0), Validators.max(1000)])

  activeModal = inject(NgbActiveModal);

  date: dateStruct = {
    date: '',
    startTime: '',
    endTime: ''
  };

  ngOnInit(): void {
    this.fillDateStruct();
  }

  fillDateStruct() {
    const dateStart = new Date(this.start);
    const dateEnd = new Date(this.end);

    this.date.date = dateStart.toISOString().split('T')[0];

    this.date.startTime = dateStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
    this.date.endTime = dateEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  }

  confirm() {
    if (this.price.valid) this.activeModal.close({ reason: 'confirmed', price: this.price.value })
  }
  cancel() {
    this.activeModal.close({reason: 'cancelled'})

  }
}
