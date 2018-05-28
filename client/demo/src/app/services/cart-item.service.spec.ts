import { TestBed, inject } from '@angular/core/testing';

import { CartItemService } from './cart-item.service';

describe('CartItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartItemService]
    });
  });

  it('should be created', inject([CartItemService], (service: CartItemService) => {
    expect(service).toBeTruthy();
  }));
});
