import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../Products.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  private totalCount: number = 0; // Total count variable
  private cartItems: Product[] = []; // Array to store cart items

  constructor() { }

  updateCartCount(count: number): void {
    
    this.totalCount += count; // Increment total count
    this.cartCountSubject.next(this.totalCount); // Emit the updated count
  }

  addToCart(product: Product): void {
    const existingItemIndex = this.cartItems.findIndex(item => item.name === product.name);
    if (existingItemIndex !== -1) {
      // Product already exists in the cart, update its quantity
      this.cartItems[existingItemIndex].quantity++;
    } else {
      // Product doesn't exist in the cart, add it with quantity 1
      product.quantity = 1;
      this.cartItems.push(product);
      // this.updateCartCount(1); // Increment cart count
    }
  }

  clearCart(): void {
    this.cartItems = []; // Clear the cart items array
    this.totalCount = 0; // Reset the total count
    this.cartCountSubject.next(0); // Emit the updated count
  }

  getCartItems(): Product[] {
    return this.cartItems; // Return cart items
  }

  removeFromCart(item: Product): void {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.updateCartCount(-1); // Decrement cart count
    }
  }

  incrementQuantity(index: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems[index].quantity++; // Increment quantity of the item at the specified index
    }
  }

  decrementQuantity(index: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--; // Decrement quantity of the item at the specified index
      }
    }
  }

}
