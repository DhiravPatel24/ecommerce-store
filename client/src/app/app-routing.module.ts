import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.service';
import { ProductComponent } from './product/product.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ProductpageComponent } from './productpage/productpage.component';

const routes: Routes = [
  {
    path:'cart',
    component:CartComponent
  },
  { 
    path: '', 
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { 
    path: 'home', 
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard] 
  },
  {
    path:'login',
    component:LoginComponent
  },
  { 
    path: 'product/:id', 
    component: ProductComponent 
  },
  {
    path:'contact',
    component: ContactComponent
  },
  {
    path:'about',
    component:AboutComponent
  },
  {
    path:'products',
    component:ProductpageComponent
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
