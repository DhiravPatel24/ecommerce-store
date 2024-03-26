import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable , catchError, throwError} from 'rxjs';
// store.service.ts
import { Product } from '../Products.model';



@Injectable({
  providedIn: 'root'
})
export class StoreService {
  
  private apiUrl = 'http://localhost:4242/api/images'; 
  private apiUrls = 'http://localhost:4242/products'
  private Url = 'http://localhost:4242/products';


  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  } 

  updateProduct(product: Product): Observable<Product> {
    const url = `${this.apiUrls}/${product._id}`;
    return this.http.put<Product>(url, product);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrls, product);
  }


deleteProduct(productId: string): Observable<void> {
    const url = `${this.apiUrls}/${productId}`;
    return this.http.delete<void>(url);
  }

  getProductById(productId: string): Observable<Product> {
    const url = `${this.apiUrls}/${productId}`;
    return this.http.get<Product>(url);
  }
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
   
    return throwError(error); 
  }
}
