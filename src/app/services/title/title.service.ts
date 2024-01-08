import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private pageTitle: string = 'PlayFUT-BCN';

  getPageTitle(): string {
    return this.pageTitle;
  }
}
