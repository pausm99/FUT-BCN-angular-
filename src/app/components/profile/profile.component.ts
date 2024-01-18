import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarService } from '../../services/navbar/navbar.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  public paddingTop!: string;
  @ViewChild('profileSection') profileSection?: ElementRef;

  constructor(private navbarService: NavbarService, private cd: ChangeDetectorRef) {}

  ngAfterViewChecked(): void {
    let profileElement = this.profileSection?.nativeElement;
    const styles = window.getComputedStyle(profileElement);
    const paddingBottom = Number(styles.paddingBottom.split('px')[0]);
    const paddingTop = paddingBottom + this.navbarService.getHeight();
    this.paddingTop = paddingTop + 'px !important';
    this.cd.detectChanges();
  }

}
