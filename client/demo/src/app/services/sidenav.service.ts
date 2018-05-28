import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class SidenavService {

  cartItems: Array<Object> = [];
  totalPriceVar: number;
  showSideNavbarVar: boolean;
  inOrder: boolean;
  productId: string;
  productCategory: number;
  isUpdateProduct: boolean;
  isAddProduct: boolean;
  shoppingCartIsExist: boolean;


  adminForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      img: ['', Validators.required]
    });

    this.productId = '';
    this.productCategory = 0;
    this.isUpdateProduct = false;
  }

  resetProductFields(): void {
    this.adminForm.setValue({
      name: '',
      img: '',
      price: ''
    });
    this.productId = '';
    this.productCategory = 0;
    this.isUpdateProduct = false;
    this.isAddProduct = false;
    this.resetCartItem();
  }

  showSideNavbar(): boolean {
    return this.showSideNavbarVar;
  }

  setNavbarVar(flag: boolean) {
    this.showSideNavbarVar = flag;
  }

  getCartItems(): Array<Object> {
    this.totalPriceVar = this.totalPrice();
    return this.cartItems;
  }

  setCartItems(data: Array<Object>) {
    this.cartItems = data;
  }

  addCartItem(data: Object) {
    this.cartItems.push(data);
  }

  updateCartItem(cartItem: Object, product: Object, amount: number): Object {
    console.log(cartItem);
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i]['productId'] === cartItem['productId']) {
        const itemAmount = parseInt(this.cartItems[i]['amount'], 10);
        const totalPrice = parseInt(this.cartItems[i]['totalPrice'], 10);
        const amountResult = Number(amount);
        const totalAmount = Number(itemAmount + amountResult);
        const totalPriceResult = (totalPrice / itemAmount) * (itemAmount + amountResult);
        this.cartItems[i]['amount'] = itemAmount + amountResult;
        this.cartItems[i]['totalPrice'] = (this.cartItems[i]['totalPrice'] / itemAmount) * this.cartItems[i]['amount'];
        this.totalPriceVar = this.totalPrice();
        return this.cartItems[i];
      }
    }
    cartItem['img'] = product['img'];
    cartItem['name'] = product['name'];
    this.addCartItem(cartItem);
    return this.cartItems;
  }

  resetCartItem() {
    this.cartItems = [];
  }

  totalPrice(): number {
    let sum = 0;
    for (const item of this.cartItems) {
      sum += item['totalPrice'];
    }
    return sum;
  }

  getTotalPrice(): number {
    return this.totalPriceVar;
  }

  removeCartItem(id: string): null | Object {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i]['productId'] === id) {
        this.cartItems.splice(i, 1);
        console.log(this.cartItems);
        return this.cartItems;
      }
    }
    return null;
  }
}
