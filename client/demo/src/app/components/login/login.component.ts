import { ShoppingCartService } from './../../services/shopping-cart.service';
import { HeaderService } from './../../services/header.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLogged: boolean;
  shoppingCartIsExist: boolean;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)])
  });

  constructor(
    private _router: Router,
    private _user: UserService,
    private _headerService: HeaderService,
    private _shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    // this._user.isLogged().subscribe(res => this.isLogged = true, err => this.isLogged = false);
    this._user.isLogged().subscribe(res => {
      this.isLogged = true;
      this.shoppingCartIsExistRequest();
    });
  }

  shoppingCartIsExistRequest(): void {
    this._shoppingCartService.isExist()
      .subscribe(res => {
        this.shoppingCartIsExist = true;
      });
  }
  moveToRegister() {
    this._router.navigate(['/register']);
  }

  login() {
    if (!this.loginForm.valid) {
      console.log('Invalid'); return;
    }

    // console.log(JSON.stringify(this.loginForm.value));
    this._user.login(JSON.stringify(this.loginForm.value))
      .subscribe(
        data => {
          console.log(data);
          this._user.user().subscribe(user => {
            this._headerService.setLogged(true);
            this._headerService.setName(user['name']);
            this._router.navigate(['/user']);
          }, err => console.log(err));
        },
        error => console.error(error)
      );
  }

  moveToShop(): void {
    this._router.navigate(['/user']);
  }
}
