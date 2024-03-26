import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  cartCount: number = 0;
  @ViewChild('productContainer') productContainer!: ElementRef;


  constructor(private router:Router, public cartService:CartService){}

  goToCart():void{
    this.router.navigate(['/cart'])
  }
  isCartRoute(): boolean {
    return this.router.url === '/cart';
  }

 

  clearCart(): void {
    this.cartService.clearCart(); 
  }

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }
  scrollToProductContainer(): void {
    this.router.navigate(['/home']).then(() => {
      this.productContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  
}
