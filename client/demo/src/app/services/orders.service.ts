import { Observable } from 'rxjs/Observable';
import { EnvService } from './env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class OrdersService {

  public userOrdered: boolean;

  constructor(private _http: HttpClient, private env: EnvService) {
  }

  getOrdersCount(): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/orders/count`).map(res => res, err => Observable.throw(err.json()));
  }

  addOrder(totalPrice: number, street: string, address: string, orderPoint: string, cardDigit: string): Observable<Object> {
    return this._http.post(`${this.env.url()}/api/orders/add`, {
      totalPrice: totalPrice,
      street: street,
      address: address,
      orderPoint: orderPoint,
      cardDigit: cardDigit
    }, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      }).map(res => res, err => Observable.throw(err.json()));
  }

  // downloadOrderDetails(): Observable<Object> {
  //   return this._http.get(`${this.env.url()}/api/orders/download`, {
  //     observe: 'body',
  //     withCredentials: true,
  //     headers: new HttpHeaders().append('responseType', 'application/blob')
  //   }).map(res => {
  //     console.log(res);
  //     return res;
  //   }, err => Observable.throw(err));
  // }

  downloadOrderDetails(): Observable<File> {
    const options = {
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'blob' as 'json'
    };
    return this._http.get<File>(`${this.env.url()}/api/orders/download`, options)
      .map(res => res, err => Observable.throw(err.json()));
  }

  getLastOrder(): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/orders/last_order/date`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }

  getOrdersCountByDate(date: Date): Observable<Object> {
     return this._http.get(`${this.env.url()}/api/orders/dateCount/${date}`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }
}
