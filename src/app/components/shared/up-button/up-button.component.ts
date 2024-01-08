import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-up-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './up-button.component.html',
  styleUrl: './up-button.component.scss'
})
export class UpButtonComponent {

  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 50;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
