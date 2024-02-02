import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private pageTitle: string = 'FUT-BCN';

  getPageTitle(): string {
    return this.pageTitle;
  }
}
