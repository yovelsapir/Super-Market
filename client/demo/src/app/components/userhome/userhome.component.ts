import { CitiesService } from './../../services/cities.service';
import { CartItemService } from './../../services/cart-item.service';
import { Observable } from 'rxjs/Observable';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SidenavService } from '../../services/sidenav.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.scss']
})
export class UserhomeComponent implements OnInit {

  name: String = '';
  loginAccepted: boolean;
  isAdminAccepted: boolean;
  productList: Observable<Object>;
  showSelectCategoryMessage: boolean;
  categoriesList: Array<Object>;
  chooseProduct: Object;
  selectedIndex: number;
  searchInputValue: string;
  showProductAmountModal: boolean;

  constructor(
    private _user: UserService,
    private _sideNavBarService: SidenavService,
    private _productService: ProductsService,
    private _categoryService: CategoryService,
    private _cartItemService: CartItemService,
    private _sideNavbarService: SidenavService,
    private citiesService: CitiesService,
    private _router: Router
  ) {

    this._user.user()
      .subscribe(
        data => {
          this.loginAccepted = true;
          this.addName(data);
          this.isAdmin();
        },
        error => this._router.navigate(['/home'])
      );
  }

  addName(data) {
    this.name = data.name;
  }

  ngOnInit() {
    this._sideNavbarService.inOrder = false;
    this._sideNavBarService.setNavbarVar(true);
    this._user.isLogged().subscribe(res => {
      this.getCategories();
      this.showSelectCategoryMessage = true;
      this.selectedIndex = 1;
    });
  }

  showNavbar(): Boolean {
    return this._sideNavBarService.showSideNavbar();
  }

  loadProducts(value: string) {
    this._productService.getProductsListByCategoryId(value).subscribe(res => {
      this.productList = res['data'];
      this.showSelectCategoryMessage = false;
    }, err => console.log(err));
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(res => {
      this.categoriesList = res['data'];
    }, err => console.log(err));
  }

  productClicked(product: Object) {
    this.chooseProduct = product;
    this._sideNavBarService.productId = product['_id'];
    this._sideNavBarService.adminForm.setValue({
      name: product['name'],
      img: product['img'],
      price: product['price']
    });
    this._sideNavBarService.productCategory = this.selectedIndex;
    this._sideNavBarService.isUpdateProduct = true;
    if (!this.isAdminAccepted) {
      this.selectedIndex = 1;
      this.showProductAmountModal = true;
    }
  }

  addToCart() {
    this._cartItemService.addToCart(this.chooseProduct['_id'], this.selectedIndex).subscribe(res => {
      this._cartItemService.getCartItemById(this.chooseProduct['_id']).subscribe(data => {
        if (this._sideNavbarService.cartItems.length > 0) {
          this._sideNavbarService.updateCartItem(data['data'], this.chooseProduct, this.selectedIndex);
        } else {

          const cartItem = {
            img: this.chooseProduct['img'],
            name: this.chooseProduct['name'],
            amount: Number(data['data']['amount']),
            totalPrice: Number(data['data']['totalPrice']),
            productId: this.chooseProduct['_id'],
            shoppingCartId: data['data']['shoppingCartId']
          };

          this._sideNavbarService.setCartItems([cartItem]);
          this._sideNavbarService.shoppingCartIsExist = true;
        }
        console.log(this._sideNavBarService.cartItems);
      });
    }, err => console.log(err));
  }

  searchProductsByName() {
    if (this.searchInputValue.length > 0) {
      this._productService.getProductsByName(this.searchInputValue).subscribe(res => {
        this.productList = res['data'];
        this.showSelectCategoryMessage = false;
      }, err => console.log(err));
    } else {
      this.productList = undefined;
      this.showSelectCategoryMessage = true;
    }
    console.log(this.searchInputValue);
  }

  isAdmin(): void {
    this._user.isAdmin().subscribe(res => {
      this.isAdminAccepted = true;
      console.log(res);
    });
  }
}
