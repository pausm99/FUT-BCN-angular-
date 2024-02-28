import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { TitleService } from '../../../services/title/title.service';
import { routes } from '../../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  public title?: string;

  private modalService = inject(NgbModal);

  screenWidth!: number;

  public isAtTop: boolean = true;

  public user = this.authService.logged;
  public userInfo = this.usersService.userInfo;

  @ViewChild('closeButton', { static: false }) closeButton!: ElementRef;
  @ViewChild('navbarNav', { static: false }) navBarNav!: ElementRef;
  @ViewChild('profileMenu', { static: false }) profileMenu!: ElementRef;

  public routes = routes
        .filter(route => route && route.path)
        .filter(route => route && !route.path?.includes('**'))
        .filter(route => route && !route.path?.includes('profile'));

  constructor(
    private titleService: TitleService,
    private navbarService: NavbarService,
    private authService: AuthService,
    private router: Router,
    private usersService: UserService,
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

  logout() {
    this.router.navigate(['/home']);
    this.authService.logOut();
    this.usersService.userInfo.set({
      id: 0,
      email: '',
      name: '',
      role: ''
    });
  }

  closeNavbar() {
    if (this.navbarIsOpened()) this.screenWidth < 992 ? this.closeButton.nativeElement.click() : null;
  }

  navbarIsOpened(): boolean {
    return this.navBarNav.nativeElement.classList.contains('show');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isAtTop = window.scrollY <= 30;
  }

  profileMenuToggle() {
    const profileMenu = this.profileMenu.nativeElement;
    if (profileMenu) {
      if (profileMenu.classList.contains('active')) profileMenu.classList.remove('active');
      else profileMenu.classList.add('active');
    }
  }
}
