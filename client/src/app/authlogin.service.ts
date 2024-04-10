import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthloginService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private userService:UserService) {}

  canActivate(): boolean {
    const token = this.authService.getTokenFromCookie();
   
    const usertoken = this.userService.getTokenFromCookie()
    
    if ( usertoken) {
     
      return true;
    }else if(token){
      return true
    } 
    
    else{
     
       this.router.navigate(['/user']);
     
      return false;
    }
  }
}
