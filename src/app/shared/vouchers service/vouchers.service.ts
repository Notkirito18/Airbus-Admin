import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VouchersService {
  constructor() {}

  useVoucher(voucherId: string) {}
  deleteUnvalidVouchers() {}
}
