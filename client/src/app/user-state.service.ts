import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public usertoken: string | null = null;

  updateUser(user: any): void {
    this.currentUser.next(user);
  }

  logout(): void {
 
    this.usertoken = null;

   
    document.cookie = 'usertoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

   
  }
}
