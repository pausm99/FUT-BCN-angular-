import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarService } from '../../services/navbar/navbar.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
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
