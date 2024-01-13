import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { TitleService } from '../../../services/title/title.service';
import { routes } from '../../../app.routes';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit, OnInit {
  public title?: string;
  public filter = 'backdrop-filter: saturate(180%) blur(20px)';

  private modalService = inject(NgbModal);

  screenWidth!: number;

  public user = this.authService.logged;

  @ViewChild('closeButton', { static: false }) closeButton!: ElementRef;

  public routes = routes
        .filter(route => route && route.path)
        .filter(route => route && !route.path?.includes('**'));

  constructor(
    private titleService: TitleService,
    private navbarService: NavbarService,
    private el: ElementRef,
    private authService: AuthService,
    config: NgbModalConfig
  ) {
    this.title = this.titleService.getPageTitle();
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.navbarService.currentModalValue.subscribe((modal) => {
      setTimeout(() => {
        if (modal === 'register') this.openRegister();
        else if (modal === 'login') this.openLogin();
      }, 300);
    });
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
    this.closeNavbar();
    setTimeout(() => {
      this.modalService.open(LoginComponent);
    }, 200);
  }

  openRegister() {
    this.closeNavbar();
    setTimeout(() => {
      this.modalService.open(RegisterComponent);
    }, 200);
  }

  closeNavbar() {
    this.screenWidth < 992 ? this.closeButton.nativeElement.click() : null;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
}
