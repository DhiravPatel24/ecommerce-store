// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; 
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private userService:UserService) {}




  
   canActivate(): boolean {
    
    const token = this.authService.getTokenFromCookie();
    // const usertoken = this.userService.getTokenFromCookie()
   
    if (token) {
     
      return true;
    } else{
     
       this.router.navigate(['/login']);
     
      return false;
    }  }

  
  


  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
}
