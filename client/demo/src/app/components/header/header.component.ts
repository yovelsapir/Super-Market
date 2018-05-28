import { HeaderService } from './../../services/header.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private _router: Router, private _user: UserService, private _headerService: HeaderService) { }


  ngOnInit() {
    this._user.user().subscribe(res => {
      this._headerService.setName(res['name']);
      this._headerService.setLogged(true);
    });
  }

  logout() {
    this._user.logout()
      .subscribe(
        (data) => {
          this._headerService.setName('Guest');
          this._headerService.setLogged(false);
          this._router.navigate(['/home']);
          window.location.reload();
        },
        error => console.error(error)
      );
  }
}
