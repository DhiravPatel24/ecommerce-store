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
import { UserloginComponent } from './userlogin/userlogin.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { AuthloginService } from './authlogin.service';


const routes: Routes = [
  {
    path:'cart',
    component:CartComponent,
    canActivate:[AuthloginService]
  },
  { 
    path: '', 
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate:[AuthloginService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'login',
    component:LoginComponent
  },
  { 
    path: 'product/:id', 
    component: ProductComponent,
    canActivate:[AuthloginService]
  },
  {
    path:'contact',
    component: ContactComponent,
    canActivate:[AuthloginService]
  },
  {
    path:'about',
    component:AboutComponent,
    canActivate:[AuthloginService]
  },
  {
    path:'products',
    component:ProductpageComponent,
    canActivate:[AuthloginService]
  },
  {
    path:'user',
    component:UserloginComponent
  },
  {
    path:'createuser',
    component:CreateuserComponent
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
