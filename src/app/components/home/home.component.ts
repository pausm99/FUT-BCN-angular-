import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../services/navbar/navbar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbProgressbar],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewChecked {

  public paddingTop!: string;
  @ViewChild('heroSection') heroSection?: ElementRef;

  constructor(private navbarService: NavbarService, private cd: ChangeDetectorRef) {}

  ngAfterViewChecked(): void {
    let heroElement = this.heroSection?.nativeElement;
    const styles = window.getComputedStyle(heroElement);
    const paddingBottom = Number(styles.paddingBottom.split('px')[0]);
    const paddingTop = paddingBottom + this.navbarService.getHeight();
    this.paddingTop = paddingTop + 'px !important';
    this.cd.detectChanges();
  }

}
