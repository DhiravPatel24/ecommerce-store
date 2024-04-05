import { Component, OnInit } from '@angular/core';
import { Product } from '../../Products.model';
import { StoreService } from '../store.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError, tap, throwError } from 'rxjs';
import { OrderService } from '../order.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  
  constructor(private productService:StoreService, private router:Router,private authservice: AuthService, private orderService:OrderService, private http:HttpClient){}
  
  
  products:Product[]=[];
  product: Product[] = [];
  selectedProduct: Product | null = null;
  newProduct: Product = {  name: '', description: '', price: 0, image: '', quantity: 0 }; 
  selectedFileName: string = '';
  currentPage: number = 1; 
  itemsPerPage: number = 7; 
   searchQuery: string = '';

  orders: any = [];
  contacts: any=[];
  showcontactpage = false
  showorder:boolean = false
  productpage:boolean = true
  sidebar:boolean=true
  showAddForm:boolean= false
  showEditForm = false;


  ngOnInit(): void {
    this.loadProducts()
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });

    this.orderService.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );

    this.http.get<any[]>('http://localhost:4242/contacts').subscribe(
      (response) => {
        this.contacts = response;
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }
  parseItem(itemString: string): any[] {
    try {
      const parsedItem = JSON.parse(itemString);
      return Array.isArray(parsedItem) ? parsedItem : [];
    } catch (error) {
      console.error('Error parsing item:', error);
      return [];
    }
  }
  

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  // getPaginatedProducts(): Product[] {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = Math.min(startIndex + this.itemsPerPage, this.products.length);
  //   return this.products.slice(startIndex, endIndex);
  // }
  filteredAndPaginatedProducts(): Product[] {
    let filteredProducts = this.products;
  
    // Filter products based on search query
    if (this.searchQuery.trim() !== '') {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  
  
    // Calculate pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, filteredProducts.length);
  
    // Return paginated products
    return filteredProducts.slice(startIndex, endIndex);
  }

  sort() : Product[]{
    let filteredProducts = this.products;
  
    // Filter products based on search query
    if (this.searchQuery.trim() !== '') {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    return filteredProducts.sort((a, b) => a.price - b.price);
  }
  reversesort():Product[]{
    let filteredProducts = this.products;
  
    // Filter products based on search query
    if (this.searchQuery.trim() !== '') {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    return filteredProducts.sort((a, b) => b.price - a.price);
  }
  

  // filteredProducts() {
  //   if (this.searchQuery.trim() === '') {
  //     return this.products; 
  //   } else {
  //     return this.products.filter(product =>
  //       product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  //     );
  //   }
  // }

  getPageNumbers(): number[] {
    const totalProducts = this.products.length;
    const totalPages = Math.ceil(totalProducts / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getTotalPages(): number {
    const totalProducts = this.products.length;
    return Math.ceil(totalProducts / this.itemsPerPage);
  }


  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
 
  
    this.showEditForm=true
  }

  cancelEdit(): void {
    this.selectedProduct = null; 
    this.showEditForm=false
  }

   updateProduct(form: NgForm): void {
    if (!this.selectedProduct) {
      console.error('Selected product is null.');
      return;
    }
    this.productService.updateProduct(this.selectedProduct).subscribe(
      updatedProduct => {
        const index = this.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.showEditForm = false;
        this.selectedProduct = null;
        form.resetForm();
        console.log('Product updated successfully:', updatedProduct);
      },
      error => {
        console.error('Error updating product:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
   
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.newProduct.image = reader.result as string;
        if (this.selectedProduct !== null && this.selectedProduct !== undefined) {
          this.selectedProduct.image = reader.result as string
          }

      console.log(this.newProduct)
    
  }
  }

  togglecontactpage(){
    this.showcontactpage=true
    
  }

  togglesidebar(){
    this.sidebar=!this.sidebar
  }

  toggleproduct(){
    this.productpage=true
    this.showorder=false
    this.showcontactpage=false
  }

  toggleorder(){
    this.showorder=true
    this.showcontactpage=false
  }  

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetNewProduct(); 
    }
  }

  resetNewProduct(): void {
    this.showAddForm=false
    this.newProduct = { name: '', description: '', price: 0, image: '', quantity:0 }; 
  }


  saveProduct(form: NgForm): void {
  
    if (form.invalid) {
      return;
    }
   
    this.productService.addProduct(this.newProduct).subscribe(
      (response) => {
       
        console.log('Product added successfully:', response);
        
        form.resetForm();
        this.newProduct = { name: '', description: '', price: 0, image: '' , quantity:0};
        this.showAddForm=false
      },
      (error) => {
       
        console.error('Error adding product:', error);
      }
    );
  }



  deleteProduct(productId: any): void {
    if (!productId) {
      console.error('Product ID is undefined.');
      return;
    }

    this.productService.deleteProduct(productId).subscribe(() => {
     
      this.products = this.products.filter(product => product._id !== productId);
    }, error => {
      console.error('Error deleting product:', error);
    });
  }
  
  onLogOut():void{
    this.authservice.logout()
    this.router.navigate(['/login'])
    
   
  }


}
