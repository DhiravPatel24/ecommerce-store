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
 
  @Input() product!: Product;
  cartItems: Product[] = [];
   user:string = ''

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
    
    return description.split('\n');
}
addToCart(product: Product): void {
    
 
  this.cartService.updateCartCount(1);

  
  this.cartService.addToCart(product);
}


async onCheckouts(productId: string): Promise<void> {
  try {
    
    const productResponse: any = await this.http.get<any>(`http://localhost:4242/products/${productId}`).toPromise();
  
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString !== null) {
      // Parse the JSON string to get the currentUser object
      const currentUser = JSON.parse(currentUserString);
  
      const username = currentUser?.username;
      this.user = username
      console.log(username)
    }

    const requestBody = {
      username:  this.user ,
      name: productResponse.name,
      description: productResponse.description,
      price: productResponse.price,
      quantity: 1 
    };
 const response: any = await this.http.post<any>(`http://localhost:4242/checkout/${productId}`, requestBody).toPromise();

    
    const stripe = await loadStripe('pk_test_51OvdziSEeNnK6Y0xdAtv4rtAED3VD8lhkHl3eYVgIF0adsvpV2n1gVm47j1VmO9koZZiZ48kytK9Dt9Dn8dXQvI000jZoCzRVY');

   
    if (stripe) {
      stripe.redirectToCheckout({
        sessionId: response.sessionId 
        
      });
      
    }
  } catch (error) {
    console.error('Error during checkout:', error);
  }
}







}

  

