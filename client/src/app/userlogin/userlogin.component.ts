import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent implements OnInit{


  username: string = '';
  password: string = '';

  constructor(private userService:UserService, private router:Router, private http:HttpClient, private locationService:LocationService){}

  ngOnInit(): void {
    // this.getLocation()
  }

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

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude)
        this.locationService.getCityName(latitude, longitude)
          .subscribe(cityName => {
            console.log('City name:', cityName);
            // Do something with the city name
          }, error => {
            console.error('Error:', error.message);
          });
        // Send location data to backend API
        this.sendLocationToBackend(latitude, longitude);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  sendLocationToBackend(latitude: number, longitude: number) {
    const apiUrl = 'http://localhost:4242/user';
    const locationData = { latitude, longitude };
    this.http.post(apiUrl, locationData).subscribe(
      (response) => {
        console.log('Location sent successfully:', response);
      },
      (error) => {
        console.error('Error sending location:', error);
      }
    );
  }

}
