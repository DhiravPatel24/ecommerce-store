import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {


  username: string = '';
  password: string = '';

  constructor(private userService:UserService, private router:Router){}

  onSubmit(): void {
    this.userService.login(this.username, this.password)
      .subscribe(
        response => {
         
          alert('Login successful');
          this.setTokenInCookie(response.usertoken)
          console.log('Login successful:', response);
          this.router.navigate(['/home'])


        },
        error => {
          console.error('Error logging in:', error);
          alert('Invalid username or password');
          
        }
      );
  }
  private setTokenInCookie(usertoken: any): void {
    document.cookie = `usertoken=${usertoken}; path=/; max-age=${60 * 60};`;
  }

}
