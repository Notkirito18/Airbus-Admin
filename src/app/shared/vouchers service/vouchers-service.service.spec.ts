import { TestBed } from '@angular/core/testing';

import { VouchersServiceService } from './vouchers-service.service';

describe('VouchersServiceService', () => {
  let service: VouchersServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VouchersServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
