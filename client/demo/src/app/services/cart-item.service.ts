import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';

@Injectable()
export class CartItemService {


  constructor(private _http: HttpClient, private env: EnvService) { }

  addToCart(productId: string, amount: number) {
    return this._http.post(`${this.env.url()}/api/cartItem/add`, {
      productId: productId,
      amount: amount
    }, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      });
  }

  getCartItems(): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/cartItem/getCartItems`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }

  getCartItemById(id: string): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/cartItem/getCartItemById/${id}`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }

  removeCartItem(id: string): Observable<Object> {
    return this._http.delete(`${this.env.url()}/api/cartItem/delete/${id}`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }

  removeAllCartItems(): Observable<Object> {
    return this._http.delete(`${this.env.url()}/api/cartItem/deleteAll`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }
}
