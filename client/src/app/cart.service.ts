import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../Products.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  private totalCount: number = 0; 
  private cartItems: Product[] = []; 
  constructor() { }

  updateCartCount(count: number): void {
    
    this.totalCount += count;
    this.cartCountSubject.next(this.totalCount);
  }

  addToCart(product: Product): void {
    const existingItemIndex = this.cartItems.findIndex(item => item.name === product.name);
    if (existingItemIndex !== -1) {
      
      this.cartItems[existingItemIndex].quantity++;
    } else {
      
      product.quantity = 1;
      this.cartItems.push(product);
      alert('Item added into Cart')
      
      
    }
  }

  clearCart(): void {
    this.cartItems = []; 
    this.totalCount = 0; 
    this.cartCountSubject.next(0);
  }

  getCartItems(): Product[] {
   
    const localStorageItems = localStorage.getItem('cartItems');
    if (localStorageItems) {
     
      return JSON.parse(localStorageItems) as Product[];
    } else {
      
      return this.cartItems;
    }
  }

  removeFromCart(item: Product): void {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.updateCartCount(-1); 
    }
  }

  incrementQuantity(index: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems[index].quantity++; 
    }
  }

  decrementQuantity(index: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--; 
      }
    }
  }

}
