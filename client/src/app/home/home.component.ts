import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../store.service';
import { Product } from '../../Products.model';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{


  imageUrls: string[] = [];
  selectedProduct: Product | null = null;


  products: Product[] = [];



  constructor(private storeService: StoreService, private router:Router, private cartService:CartService) { }

  ngOnInit(): void {
    this.storeService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  addToCart(product: Product): void {
    
    // Update cart count in the service
    this.cartService.updateCartCount(1);

    // Add the selected product to the cart
    this.cartService.addToCart(product);
    
  }

  showProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
}

redirectToProductPage(productId: string): void {
  this.router.navigate(['/product', productId]); // Navigate to product page with product ID as route parameter
}



}

