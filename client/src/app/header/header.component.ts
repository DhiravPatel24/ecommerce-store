import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { UserStateService } from '../user-state.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  cartCount: number = 0;
  usertoken:any = '';
  token:any=''
  showlogindetails:boolean=false
  @ViewChild('productContainer') productContainer!: ElementRef;


  constructor(private router:Router, public cartService:CartService, public authService:AuthService , private userStateService:UserStateService,){}

  goToCart():void{
    this.router.navigate(['/cart'])
  }
  isCartRoute(): boolean {
    return this.router.url === '/cart';
  }

  showlogin(){
    this.showlogindetails =! this.showlogindetails
  }

  clearCart(): void {
    this.cartService.clearCart(); 
  }

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }

    this.userStateService.currentUser.subscribe(user => {
     
      if (!this.currentUser || user.username !== this.currentUser.username) {
        this.currentUser = user;
     
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    });
   
    // this.userStateService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
    console.log(this.currentUser)
  }
  
  scrollToProductContainer(): void {
    this.router.navigate(['/home']).then(() => {
      this.productContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  
  onLogOut():void{
    localStorage.removeItem('currentUser');
    this.userStateService.logout()
    this.router.navigate(['/user'])
    
   
  }
 



}
