import { Injectable } from '@angular/core';

@Injectable()
export class EnvService {


  constructor() { }

  url(): String {
    return 'http://localhost:3400';
  }

}
