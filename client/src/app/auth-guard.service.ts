// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Your authentication service

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // canActivate(): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     return true; // User is logged in, allow access to the route
  //   } else {
  //     this.router.navigate(['/login']); // Redirect to login page if user is not logged in
  //     return false; // Prevent access to the route
  //   }
  // }

  canActivate(): boolean {
    if (this.authService.getToken() || this.authService.isLoggedIn()) {
      console.log(this.authService.getToken());
      return true; // User is logged in or token is present, allow access to the route
    } else {
      this.router.navigate(['/login']); // Redirect to login page if user is not logged in
      return false; // Prevent access to the route
    }
  }
  

  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
}
