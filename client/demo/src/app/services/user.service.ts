import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from './env.service';

@Injectable()
export class UserService {

  constructor(private _http: HttpClient, private env: EnvService) { }

  register(body: any) {
    return this._http.post(`${this.env.url()}/users/register`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  login(body: any) {
    return this._http.post(`${this.env.url()}/users/login`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  user() {
    return this._http.get(`${this.env.url()}/users/user`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  isLogged() {
    return this._http.get(`${this.env.url()}/users/isLogged`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  logout() {
    return this._http.get(`${this.env.url()}/users/logout`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getUserName(): Observable<Object> {
    return this._http.get(`${this.env.url()}/api/username`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  isAdmin(): Observable<Object> {
    return this._http.get(`${this.env.url()}/users/isAdmin`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).map(res => res, err => Observable.throw(err.json()));
  }
}
