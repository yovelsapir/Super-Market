import { Observable } from 'rxjs/Observable';
import { HeaderService } from './../../services/header.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  whichFormToShow: boolean;
  registerForm_Step1: FormGroup = null;
  registerForm_Step2: FormGroup = null;

  registerError: Object;
  registerErrorModal: boolean;
  constructor(private fb: FormBuilder, private _router: Router, private _userService: UserService, private _headerService: HeaderService) {
  }

  ngOnInit() {
    this._userService.isLogged().subscribe(res => {
      if (res) {
        this._userService.logout()
          .subscribe(
            (data) => {
              this._headerService.setLogged(false);
              this._headerService.setName('Guest');
              this.moveToLogin();
            },
            error => console.error(error)
          );
      }
    }, err => console.log(err));

    this.whichFormToShow = false;

    this.registerForm_Step1 = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      id: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      cpassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]]
    });

    this.registerForm_Step2 = new FormGroup({
      address: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required)
    });
  }

  validatePasswords(): boolean {
    if (this.registerForm_Step1 !== null) {
      if (this.registerForm_Step1.value['cpassword'] === this.registerForm_Step1.value['password']) {
        return true;
      }
    }
    return false;
  }

  getRegisterForm(): FormGroup {
    return this.registerForm_Step1;
  }

  moveToLogin() {
    this._router.navigate(['/home']);
  }

  next() {
    console.log(this.registerForm_Step1.value);
    if (!this.registerForm_Step1.valid || this.registerForm_Step1.value.password !== this.registerForm_Step1.value.cpassword) {
      console.log('Invalid Form'); return;
    }

    this.whichFormToShow = true;
  }

  back() {
    this.whichFormToShow = false;
  }

  register() {
    if (this.registerForm_Step1.valid && this.registerForm_Step2.valid &&
      this.registerForm_Step1.value['password'] === this.registerForm_Step1.value['cpassword']) {
      this._userService.register({
        password: this.registerForm_Step1.value['password'],
        email: this.registerForm_Step1.value['email'],
        id: this.registerForm_Step1.value['id'],
        name: this.registerForm_Step2.value['name'],
        lastName: this.registerForm_Step2.value['lastname'],
        address: this.registerForm_Step2.value['address'],
        street: this.registerForm_Step2.value['street'],
      }).subscribe(
        data => {
          this._router.navigate(['/home']);
          window.location.reload();
        }, err => {
          this.registerError = {
            code: err['error']['code'],
            statusText: err['statusText']
          };
          this.registerErrorModal = true;
        });
    }
  }
}
