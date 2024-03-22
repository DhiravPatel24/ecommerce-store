import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.service';
import { ProductComponent } from './product/product.component';

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

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
