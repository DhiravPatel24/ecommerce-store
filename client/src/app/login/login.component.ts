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

  constructor(private http:HttpClient, private router: Router, private authService:AuthService ){}


  onSubmit(): void {
    // Check if email and password are provided
    if (!this.email || !this.password) {
      console.error('Please provide both email and password');
      // Show error message to the user
      return;
    }

    // Call the login method from the authentication service
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        // Redirect to admin route upon successful login
       
        const token:any = this.authService.getToken()

        // Store token in a cookie
        this.setTokenInCookie(token);
   
        this.router.navigate(['/admin']);
      },
      error => {
        console.error('Login error:', error);
        // Handle login errors, display error message to the user
        this.loginError = error.message || 'An error occurred during login.';
      }
    );
  }

  // Function to set JWT token in a cookie
  private setTokenInCookie(token: string): void {
    document.cookie = `token=${token}; path=/; max-age=${60 * 60};`;
  }

  
}
 

