import { CitiesService } from './../../services/cities.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from './../../services/products.service';
import { CartItemService } from './../../services/cart-item.service';
import { Component, OnInit, Inject } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { OrdersService } from '../../services/orders.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {

  cartItems: Array<Object> = [];
  citiesList: Array<Object> = [];
  private OrderPointCountUnder3: boolean;

  orderForm: FormGroup = new FormGroup({
    address: new FormControl(null, Validators.required),
    street: new FormControl(null, Validators.required),
    date: new FormControl(null, [Validators.required]),
    card: new FormControl(null,
      [Validators.required, Validators
        .pattern(/\d{4}[\s\-]*\d{4}[\s\-]*\d{4}[\s\-]*\d{4}/)])
  });

  constructor(
    private _cartItemService: CartItemService,
    private _ordersService: OrdersService,
    private _productsService: ProductsService,
    private _sideNavbarService: SidenavService,
    private _citiesService: CitiesService) { }

  ngOnInit() {
    this.getCartItemsList();
  }

  getCartItemsList() {
    return this._cartItemService.getCartItems().subscribe(data => {
      console.log(data);
      // this._sideNavbarService.setCartItems(data['data']);
      this.cartItems = [];
      for (const item of data['data']) {
        this._productsService.getProductById(item['productId']).subscribe(res => {
          item.name = res['data']['name'];
          item.img = res['data']['img'];
          this.cartItems.push(item);
        }, err => console.log(err));
      }
    }, err => console.log(err));
  }

  totalPrice(): number {
    let sum = 0;
    for (const item of this.cartItems) {
      sum += item['totalPrice'];
    }
    return sum;
  }

  getCitiesByName(name: string) {
    this._citiesService.getCitiesByName(name).subscribe(res => {
      this.citiesList = res['locations'];
    });
  }

  getCitiesList() {
    this.getCitiesByName(this.orderForm.value.address);
  }

  orderAccepted() {
    this._sideNavbarService.inOrder = false;
    this._ordersService.userOrdered = false;
  }

  downloadOrderInvoice() {
    this._ordersService.downloadOrderDetails().subscribe(res_d => {
      console.log(res_d);
      const blob = new Blob([res_d],
        { type: 'text/plain' });
      const file = new File([blob], 'חשבונית.txt',
        { type: 'text/plain' });

      saveAs(file);
    }, err => console.log(err));
  }

  onSubmit() {
    this._ordersService.getOrdersCountByDate(this.orderForm.value.date).subscribe(res => {
      if (res['count'] >= 3) {
        this.OrderPointCountUnder3 = true;
      } else {
        this._ordersService.addOrder(this.totalPrice(), this.orderForm.value['street'], this.orderForm.value['address'],
          this.orderForm.value['date'], this.orderForm.value['cardDigit']).subscribe(res_order => {
            this._ordersService.userOrdered = true;
          }, err => {
            console.log(err);
          });
      }
    }, err => console.log(err));
  }

  checkIfDateIsCurrent(): boolean {
    const d = new Date();
    const resDate = new Date(this.orderForm.value.date);
    if (d.getDay() > resDate.getDay() || d.getFullYear() > resDate.getFullYear() || d.getMonth() > resDate.getMonth()) {
      return true;
    }
    return false;
  }

  checkIfOrderPointCountUnder3(): void {
    this._ordersService.getOrdersCountByDate(this.orderForm.value.date).subscribe(res => {
       console.log(res);
    }, err => console.log(err));
  }
}

