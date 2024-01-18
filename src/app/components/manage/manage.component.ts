import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ListComponent } from '../reservation/list/list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFieldComponent } from './add-field/add-field.component';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent {

  public isCompany: boolean = true;

  public paddingTop!: string;
  @ViewChild('manageSection') manageSection?: ElementRef;


  constructor(
    private navbarService: NavbarService,
    private cd: ChangeDetectorRef,
    private modal: NgbModal
  ) {}

  ngAfterViewChecked(): void {
    let manageElement = this.manageSection?.nativeElement;
    const styles = window.getComputedStyle(manageElement);
    const paddingBottom = Number(styles.paddingBottom.split('px')[0]);
    const paddingTop = paddingBottom + this.navbarService.getHeight();
    this.paddingTop = paddingTop + 'px !important';
    this.cd.detectChanges();
  }

  addNewField() {
    this.modal.open(AddFieldComponent);
  }

}
