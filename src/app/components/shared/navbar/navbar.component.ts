import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { TitleService } from '../../../services/title/title.service';
import { routes } from '../../../app.routes';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {
  public title?: string;
  public filter = 'backdrop-filter: saturate(180%) blur(20px)';

  public user: boolean = false;

  private modalService = inject(NgbModal);

  @ViewChild('miElenavBarmento') navBar?: ElementRef;


  public routes = routes
        .filter(route => route && route.path)
        .filter(route => route && !route.path?.includes('**'));

  constructor(
    private titleService: TitleService,
    private navbarService: NavbarService,
    private el: ElementRef,
    config: NgbModalConfig
  ) {
    this.title = this.titleService.getPageTitle();
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true;
  }

  ngAfterViewInit(): void {
    const height = this.getNavbarHeight();
    this.navbarService.setHeight(height);
  }

  getNavbarHeight() {
    return this.el.nativeElement.querySelector(':first-child').offsetHeight;
  }

  quitFilter() {
    setTimeout(() => {
      this.filter = 'backdrop-filter: none';
    }, 100);
  }

  addFilter() {
    setTimeout(() => {
      this.filter = 'backdrop-filter: saturate(180%) blur(20px)';
    }, 200);
  }

  openLogin() {
    const modalref = this.modalService.open(LoginComponent);
  }

  openRegister() {
    const modalref = this.modalService.open(RegisterComponent);
  }
}
