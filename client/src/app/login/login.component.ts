import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string ='';
  admin:boolean = false

  constructor(private http:HttpClient, private router: Router, private authService:AuthService ){}


  onSubmit(): void {
   
    if (!this.email || !this.password) {
      console.error('Please provide both email and password');
      
      return;
    }
  
    
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
       
        if (response) {
          
          const token: any = response.token;
          console.log(token)

          
          this.setTokenInCookie(token);
          this.admin=true
          this.router.navigate(['/admin']);
        } else {
          
          console.error('Login failed:', response.message);
          
          this.loginError = response.message || 'An error occurred during login.';
        }
      },
      error => {
        console.error('Login error:', error);
       
        this.loginError = error.message || 'An error occurred during login.';
      }
    );
  }

 
  private setTokenInCookie(token: any): void {
    document.cookie = `token=${token}; path=/; max-age=${60 * 60};`;
  }

  
}
 

