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
  user: any;
  totalprice:number = 0

  constructor(private cartService: CartService , private http:HttpClient) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  clearCart(): void {
    this.cartService.clearCart(); 
  } 

  removeFromCart(item: Product): void {
    this.cartService.removeFromCart(item); 
    this.cartItems = this.cartItems.filter(i => i !== item); 
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
    this.totalprice = totalPrice;
    return totalPrice;
}

async onCheckout(): Promise<void> {
  try {

    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString !== null) {
      // Parse the JSON string to get the currentUser object
      const currentUser = JSON.parse(currentUserString);
  
      // Access the username property from the currentUser object using optional chaining
      const username = currentUser?.username;
      this.user = username
      console.log(username)
    }

   const res: any = await this.http.post('http://localhost:4242/checkout', {
        items: this.cartItems,
        totalprice:this.totalprice,
        username:this.user
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