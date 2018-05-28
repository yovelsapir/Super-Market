import { UserService } from './user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderService {
  isLogged: boolean;
  name: string;
  constructor(private _user: UserService) {
    this.name = 'Guest';
    this.isLogged = false;
  }

  setName(name: string) {
    this.name = name;
  }

  setLogged(flag: boolean) {
    this.isLogged = flag;
  }

  getLogged(): boolean {
    return this.isLogged;
  }

  getName(): string {
    return this.name;
  }
}
