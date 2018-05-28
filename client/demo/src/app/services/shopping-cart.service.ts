import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';

@Injectable()
export class ShoppingCartService {

  constructor(private _http: HttpClient, private env: EnvService) { }

  isExist(): Observable<boolean> {
    return this._http.get(`${this.env.url()}/api/shoppingCart/exist`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res['data'], err => Observable.throw(err.json()));
  }

  openShoppingCart(): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/shoppingCart/add`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
