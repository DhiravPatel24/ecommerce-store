import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  name: any;
  email: any;
  message: any;


  constructor(private http:HttpClient){}

  onSubmit(): void {
    const formData = {
      name: this.name,
      email: this.email,
      message: this.message
    };
  
    this.http.post<any>('https://ecommerce-store-smoky-zeta.vercel.app/contact', formData).subscribe(
      response => {

        console.log(response);
        alert('Message Successfully Sent !!')
       
        this.clearForm();
      },
      error => {
        console.error('Error submitting contact form:', error);
       
      }
    );
  }

  clearForm(): void {
  
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
