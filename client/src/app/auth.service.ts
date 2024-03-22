import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = false;
  public token: string | null = null;

  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<boolean> {

    return this.http.post<any>('http://localhost:4242/login', { email, password }).pipe(
      map(response => {
    
        if (response && response.message === 'Login successful') {
    
          this.loggedIn = true;
   
          this.token = response.token;
          return true;
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

  logout(): void {
    // Implement logout logic (if needed)
    this.token = null; // Clear the token on logout
    this.loggedIn = false;
  }
}
