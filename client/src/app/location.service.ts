import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude)
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

  getCityName(latitude: number, longitude: number): Observable<string> {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        if (response.address && response.address.state_district) {
          const cityName = response.address.state_district;
          return cityName;
        } else {
          throw new Error('City name not found in response');
        }
      })
    );
  }
}

