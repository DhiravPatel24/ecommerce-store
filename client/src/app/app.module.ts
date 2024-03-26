import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StoreService } from './store.service';
import { HeaderComponent } from './header/header.component';
import { CartComponent } from './cart/cart.component';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { ProductComponent } from './product/product.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    CartComponent,
    AdminComponent,
    LoginComponent,
    FooterComponent,
    ProductComponent,
    ContactComponent,
    AboutComponent   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    HttpClientModule,
    FormsModule,

  ],
  providers: [
    provideClientHydration(),
    StoreService,
    AuthService,
    AuthGuard
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
