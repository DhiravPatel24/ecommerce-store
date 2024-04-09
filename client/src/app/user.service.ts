import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { UserStateService } from './user-state.service';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public loggedIn = false;
  
  public usertoken: string | null = null;
   private apiUrl = 'http://localhost:4242/createuser';
   private apiUrls = 'http://localhost:4242/user';
  
 
  constructor(private http:HttpClient, private userStateService:UserStateService, private locationService:LocationService) { }

  signUp(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password }); 
  }

  login(username: string, password: string): Observable<any> {

     return this.http.post(this.apiUrls, { username, password }).pipe(
      tap((response: any) => {
        
        this.loggedIn = true;
        this.usertoken = response.usertoken
        
        localStorage.setItem('currentUser', JSON.stringify({ username }));
        const user = { username }; 
        console.log(user.username);
       

        this.userStateService.updateUser(user);
      })
    );
  }

  getTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('usertoken=')) {
        return cookie.substring(6);
      }
    }
    return null; 
  }
  
  isLoggedIn(): boolean {
    return this.loggedIn;
  }

}
