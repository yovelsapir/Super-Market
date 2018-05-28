import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { ProductsService } from './../../services/products.service';
import { CartItemService } from './../../services/cart-item.service';
import { SidenavService } from './../../services/sidenav.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  isAdminAccepted: boolean;
  categoriesList: Array<Object>;
  adminForm: FormGroup;

  constructor(
    private _user: UserService,
    private _sideNavbarService: SidenavService,
    private _cartItemService: CartItemService,
    private _productsService: ProductsService,
    private _categoryService: CategoryService,
    private shoppingCartService: ShoppingCartService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this._sideNavbarService.inOrder = false;
    this.shoppingCartExist();
    this._sideNavbarService.resetCartItem();
    this.getCartItemsList();

    this.isAdmin();

    console.log(this._sideNavbarService.getCartItems());
  }

  sideNavbarToggle() {
    this._sideNavbarService.setNavbarVar(!this.showSideNavbar());
  }

  showSideNavbar(): boolean {
    return this._sideNavbarService.showSideNavbar();
  }

  shoppingCartExist() {
    this.shoppingCartService.isExist().subscribe(data => {
      this._sideNavbarService.shoppingCartIsExist = data;
    }, err => console.log(err));
  }

  getCartItemsList() {
    return this._cartItemService.getCartItems().subscribe(data => {
      console.log(data);
      // this._sideNavbarService.setCartItems(data['data']);

      for (const item of data['data']) {
        this._productsService.getProductById(item['productId']).subscribe(res => {
          console.log(item);
          item.name = res['data']['name'];
          item.img = res['data']['img'];
          this._sideNavbarService.addCartItem(item);
        }, err => console.log(err));
      }
    }, err => console.log(err));
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(res => {
      this.categoriesList = [];
      for (const category of res['data']) {
        this.categoriesList.push({
          value: category['_id'],
          label: category['name']
        });
      }

      this._sideNavbarService.productCategory = this.categoriesList[0]['value'];
    }, err => console.log(err));
  }

  removeCartItem(id: string) {
    this._cartItemService.removeCartItem(id).subscribe(res => {
      this._sideNavbarService.removeCartItem(id);
    }, err => console.log(err));
  }

  openOrderView() {
    this._sideNavbarService.inOrder = true;
  }

  addProductForm(): void {
    this._sideNavbarService.resetProductFields();
    this._sideNavbarService.isAddProduct = true;
  }

  onSubmit(): void {
    // ADD NEW PRODUCT
    if (this._sideNavbarService.isAddProduct) {
      this._productsService.addNewProduct({
        name: this._sideNavbarService.adminForm.value.name,
        img: this._sideNavbarService.adminForm.value.img,
        price: this._sideNavbarService.adminForm.value.price,
        categoryId: this._sideNavbarService.productCategory
      }).subscribe(res => {
        this._sideNavbarService.resetProductFields();
      }, err => {
        console.log(err);
      });
    } else if (this._sideNavbarService.isUpdateProduct) { // UPDATE PRODUCT
      this._productsService.updateProduct({
        name: this.adminForm.value['name'],
        img: this.adminForm.value['img'],
        price: this.adminForm.value['price'],
        productId: this._sideNavbarService.productId
      }).subscribe(res => {
        this._sideNavbarService.resetProductFields();
      }, err => {
        console.log(err);
      });
    }
  }

  deleteAllCartItems(): void {
    this._cartItemService.removeAllCartItems().subscribe(res => {
      this._sideNavbarService.resetProductFields();
    });
  }

  isAdmin(): void {
    this._user.isAdmin().subscribe(res => {
      this.isAdminAccepted = true;
      this._sideNavbarService.isUpdateProduct = false;
      this.getCategories();

      this.adminForm = this._sideNavbarService.adminForm;
    });
  }
}
