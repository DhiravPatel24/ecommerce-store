import { Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import { Product } from '../../Products.model';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { StoreService } from '../store.service';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  // product: Product | undefined;
  @Input() product!: Product;
  cartItems: Product[] = [];
 

  constructor(private route:ActivatedRoute, private cartService:CartService,private productService:StoreService, private http:HttpClient){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.productService.getProductById(productId).subscribe(
        (product: Product) => {
          this.product = product;
         this.cartItems.push(product)
        },
        (error) => {
          console.error('Error fetching product:', error);
        }
      );
    });
  }

  getDescriptionPoints(description: any): string[] {
    // Split the description string based on two consecutive spaces followed by a newline character
    return description.split('\n');
}
addToCart(product: Product): void {
    
  // Update cart count in the service
  this.cartService.updateCartCount(1);

  // Add the selected product to the cart
  this.cartService.addToCart(product);
}

async onCheckouts(productId: string): Promise<void> {
  try {
    // Fetch the details of the selected product from the backend
    const productResponse: any = await this.http.get<any>(`http://localhost:4242/products/${productId}`).toPromise();
    
    // Prepare the request payload with details of the selected product
    const requestBody = {
      name: productResponse.name,
      description: productResponse.description,
      price: productResponse.price,
      quantity: 1 // Assuming the quantity is always 1 for a single product checkout
    };

    // Send the HTTP POST request to the server to initiate the checkout session for the selected product
    const response: any = await this.http.post<any>(`http://localhost:4242/checkout/${productId}`, requestBody).toPromise();

    // Load Stripe
    const stripe = await loadStripe('pk_test_51OvdziSEeNnK6Y0xdAtv4rtAED3VD8lhkHl3eYVgIF0adsvpV2n1gVm47j1VmO9koZZiZ48kytK9Dt9Dn8dXQvI000jZoCzRVY');

    // Redirect to checkout if Stripe is loaded
    if (stripe) {
      stripe.redirectToCheckout({
        sessionId: response.sessionId // Assuming response contains the session ID
      });
    }
  } catch (error) {
    console.error('Error during checkout:', error);
  }
}







}

  

