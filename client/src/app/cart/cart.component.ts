import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../../Products.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];

  constructor(private cartService: CartService , private http:HttpClient) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    
  }

  clearCart(): void {
    this.cartService.clearCart(); // Call clearCart method
  } 

  removeFromCart(item: Product): void {
    this.cartService.removeFromCart(item); // Remove the item from the cart service
    this.cartItems = this.cartItems.filter(i => i !== item); // Remove the item from the local cart array
  }

  incrementQuantity(index: number): void {
    this.cartService.incrementQuantity(index);
    this.cartItems = this.cartService.getCartItems();
  }

  decrementQuantity(index: number): void {
    this.cartService.decrementQuantity(index);
    this.cartItems = this.cartService.getCartItems();
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (let item of this.cartItems) {
        totalPrice += item.price * item.quantity;
    }
    return totalPrice;
}

async onCheckout(): Promise<void> {
  try {
   const res: any = await this.http.post('http://localhost:4242/checkout', {
        items: this.cartItems
      }).toPromise();

    const stripe = await loadStripe('pk_test_51OvdziSEeNnK6Y0xdAtv4rtAED3VD8lhkHl3eYVgIF0adsvpV2n1gVm47j1VmO9koZZiZ48kytK9Dt9Dn8dXQvI000jZoCzRVY');
    if (stripe) {
      stripe.redirectToCheckout({
        sessionId: res.id
      });
    }
  } catch (error) {
    console.error('Error during checkout:', error);
  }
}

}