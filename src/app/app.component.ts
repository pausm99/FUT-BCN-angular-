import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { UpButtonComponent } from './components/shared/up-button/up-button.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ToastsComponent } from './components/shared/toasts/toasts/toasts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, UpButtonComponent, FooterComponent, ToastsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
