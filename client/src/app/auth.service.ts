import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserStateService } from './user-state.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = false;
  public token: string | null = null;

  constructor(private http: HttpClient, private userStateService:UserStateService) {}
  login(email: string, password: string): Observable<boolean> {

    
    return this.http.post<any>('https://ecommerce-store-smoky-zeta.vercel.app/login', { email, password }).pipe(
      map(response => {
        if (response && response.token) {
         
       
          this.loggedIn = true;
          this.token = response.token;
          return response; 
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false); 
      })
    );
  }
  getToken(): string | null {
    return this.token;
  }


  isLoggedIn(): boolean {
    return this.loggedIn;
  }


  getTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('token=')) {
        return cookie.substring(6);
      }
    }
    return null; 
  }

  logout(): void {
 
    this.token = null;

   
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

   
  }

}
