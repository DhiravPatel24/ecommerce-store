import { Component, OnInit } from '@angular/core';
import { Product } from '../../Products.model';
import { StoreService } from '../store.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  products:Product[]=[];

  constructor(private productService:StoreService, private router:Router,private authservice: AuthService){}

  showAddForm:boolean= false
  showEditForm = false;
  product: Product[] = [];
  selectedProduct: Product | null = null;
  currentPage: number = 1; // Initialize current page to 1
  itemsPerPage: number = 7; // Set items per page to 5



  newProduct: Product = { name: '', description: '', price: 0, image: '', quantity: 0 }; // Initialize with default quantity

  ngOnInit(): void {
    this.loadProducts()
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
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

  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.products.length);
    return this.products.slice(startIndex, endIndex);
  }

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
   // Make a copy of the selected product
    this.showEditForm=true
  }

  cancelEdit(): void {
    this.selectedProduct = null; // Reset selectedProduct to null to hide the form
    this.showAddForm=false
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
    if (file && this.selectedProduct) { // Check if selectedProduct is not null
      console.log(this.selectedProduct)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (this.selectedProduct !== null && this.selectedProduct !== undefined) {
          this.selectedProduct.image=reader.result as string
        }
        
        
      };
    }
  }
  
  

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetNewProduct(); // Reset newProduct when hiding the form
    }
  }

  resetNewProduct(): void {
    this.newProduct = { name: '', description: '', price: 0, image: '', quantity:0 }; // Reset to empty values
  }


  saveProduct(form: NgForm): void {
    // Check if the form is valid
    if (form.invalid) {
      return;
    }
    // Call the method in your service to save the product to the database
    this.productService.addProduct(this.newProduct).subscribe(
      (response) => {
        // Handle success response if needed
        console.log('Product added successfully:', response);
        // Reset the form and newProduct
        form.resetForm();
        this.newProduct = { name: '', description: '', price: 0, image: '' , quantity:0};
        this.showAddForm=false
      },
      (error) => {
        // Handle error response if needed
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
      // Remove the deleted product from the products array
      this.products = this.products.filter(product => product._id !== productId);
    }, error => {
      console.error('Error deleting product:', error);
    });
  }
  
  onLogOut():void{
    this.router.navigate(['/login'])
    
   
  }


}
