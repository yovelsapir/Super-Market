import { Observable } from 'rxjs/Observable';
import { EnvService } from './env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductsService {

  constructor(private _http: HttpClient, private env: EnvService) { }

  getProductsCount(): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/products/count`).map(res => res, err => Observable.throw(err.json()));
  }

  getProductsByName(name: string): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/products/getProductsByName/${name}`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }

  getProductsListByCategoryId(id: string): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/products/getProductsById/${id}`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }

  getProductById(id: string): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/products/getProductById/${id}`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }

  addNewProduct(body: Object): Observable<Object> {
    return this._http.post(`${this.env.url()}/api/products/add`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }

  updateProduct(body: Object): Observable<Object> {
    return this._http.patch(`${this.env.url()}/api/products/update`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }
}
