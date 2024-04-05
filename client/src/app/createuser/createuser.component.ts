import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css'
})
export class CreateuserComponent {

  username: string='';
  password: string='';

  constructor(private userService:UserService, private router:Router){}

  
  onSubmit(): void {
    this.userService.signUp(this.username, this.password)
      .subscribe(
        response => {
          alert(response.message); 
         this.router.navigate(['/user'])
          this.username = '';
          this.password = '';
        },
        error => {
          console.error('Error creating user:', error);
          alert('Error creating user');
          
        }
      );
  }
  
}
