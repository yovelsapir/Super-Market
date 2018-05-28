import { ShoppingCartService } from './../../services/shopping-cart.service';
import { OrdersService } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  providers: [
    ProductsService,
    OrdersService
  ]
})
export class InfoComponent implements OnInit {

  productsCount: number = Number(0);
  ordersCount: number = Number(0);
  userName: string = String('Guest');

  isLogged: boolean;
  shoppingCartExist: boolean;
  lastDate: string;
  shoppingCartStartDate: string;

  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private _user: UserService,
    private _shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    this.getUserName();
    this.getOrdersCount();
    this.getProductsCount();
  }

  getProductsCount() {
    this.productsService.getProductsCount().subscribe(res => {
      this.productsCount = res['count'];
    }, err => console.log(err));
  }

  getOrdersCount() {
    this.ordersService.getOrdersCount().subscribe(res => {
      this.ordersCount = res['count'];
    }, err => console.log(err));
  }

  getUserName() {
    this._user.getUserName().subscribe(res => {
      this.userName = res['name'];
      this.isLogged = true;

      this.isExistShoppingCart();
      this.getLastOrder();
    }, err => console.log(err));
  }

  isExistShoppingCart(): void {
    this._shoppingCartService.isExist().subscribe(res => {
      console.log(res);
      const date = new Date(res['startDate']);
      this.shoppingCartStartDate = date.toLocaleDateString();
      this.shoppingCartExist = true;
    }, err => {
      // console.log(err);
    });
  }

  getLastOrder(): void {
    this.ordersService.getLastOrder().subscribe(res => {
      console.log(res);
      const date = new Date(res['dateOrder']);
      this.lastDate = `${date.toLocaleDateString()}`;
      console.log(date);
    }, err => {
      console.log(err);
    });
  }
}
