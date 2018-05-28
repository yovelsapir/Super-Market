import { EnvService } from './env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {

  constructor(private _http: HttpClient, private env: EnvService) { }

  getCategories(): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/category/getCategories`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }
}
