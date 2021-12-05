import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AuthServiceService } from '../auth/auth-service.service';
import { Guest, Voucher } from '../models';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VouchersServiceService {
  useVoucherSub$$!: Subscription;

  token!: string | any;

  url = 'https://airbus-900f9-default-rtdb.firebaseio.com/guests.json?auth=';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  IdGenerator() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  vouchersGenerator(
    howManyToGenerate: number,
    guestToGenerateToId: string,
    validUntill: Date
  ) {
    let generatedVouchers: Voucher[] = [];
    for (let i = 0; i < howManyToGenerate; i++) {
      generatedVouchers.push(
        new Voucher(
          guestToGenerateToId + this.IdGenerator(),
          guestToGenerateToId,
          validUntill,
          new Date()
        )
      );
    }
    console.log('generated Vouchers :', generatedVouchers);
    return generatedVouchers;
  }

  useVoucher(voucherId: string) {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      this.token = user.token;
      const token = user.token;
      this.http.get(this.url + token).subscribe((data) => {
        const guestsArray = Object.values(data);
        let indexOfGuest = this.indexOfGuestFromId(
          guestsArray,
          voucherId.slice(0, 13)
        );
        if (
          this.deleteVoucher(guestsArray, voucherId)[indexOfGuest].vouchersLis
            .length !== 0
        ) {
          this.http
            .put(this.url + token, this.deleteVoucher(guestsArray, voucherId))
            .subscribe();
        }
      });
    });
  }

  deleteVoucher(arrayOfGuests: Guest[], voucherId: string) {
    let updatedArray: Guest[] = [];
    let guestId = voucherId.slice(0, 13);
    for (let i = 0; i < arrayOfGuests.length; i++) {
      if (arrayOfGuests[i].id === guestId) {
        const newVouchList = this.filterVouchers(
          arrayOfGuests[i].vouchersLis,
          voucherId
        );
        updatedArray.push({
          ...arrayOfGuests[i],
          vouchersLis:
            newVouchList.length > 0
              ? newVouchList
              : [new Voucher('', '', new Date())],
        });
      } else {
        updatedArray.push(arrayOfGuests[i]);
      }
    }
    return updatedArray;
  }

  filterVouchers(filteringArray: Voucher[], id: string) {
    let filteredArray = [];
    for (let i = 0; i < filteringArray.length; i++) {
      if (filteringArray[i].id !== id) {
        filteredArray.push(filteringArray[i]);
      }
    }
    if (filteringArray.length === filteredArray.length) {
      console.log('voucher doesnt exist, error');
      return [];
    } else {
      return filteredArray;
    }
  }

  indexOfGuestFromId(array: Guest[], id: string) {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        index = i;
      }
    }
    return index;
  }

  deleteUnvalidVouchers() {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.token = user.token;
        const token = user.token;
        this.http.get(this.url + token).subscribe((data) => {
          const guestsArray = Object.values(data);
          let updatedArray = guestsArray;
          for (let i = 0; i < guestsArray.length; i++) {
            for (let j = 0; j < guestsArray[i].vouchersLis.length; j++) {
              const voucherValidUntill = new Date(
                guestsArray[i].vouchersLis[j].validUntill.toString()
              );
              if (voucherValidUntill.getTime() < new Date().getTime()) {
                updatedArray = this.makeVoucherInvalid(
                  updatedArray,
                  guestsArray[i].vouchersLis[j].id
                );
              }
            }
          }
          this.http.put(this.url + token, updatedArray).subscribe();
        });
      }
    });
  }
  makeVoucherInvalid(arrayOfGuests: Guest[], voucherId: string) {
    let updatedArray: Guest[] = [];
    let guestId = voucherId.slice(0, 13);
    for (let i = 0; i < arrayOfGuests.length; i++) {
      if (arrayOfGuests[i].id === guestId) {
        const newVouchList = this.unvalidateVouchers(
          arrayOfGuests[i].vouchersLis,
          voucherId
        );
        updatedArray.push({ ...arrayOfGuests[i], vouchersLis: newVouchList });
      } else {
        updatedArray.push(arrayOfGuests[i]);
      }
    }
    return updatedArray;
  }
  unvalidateVouchers(filteringArray: Voucher[], id: string): Voucher[] {
    let filteredArray = [];
    for (let i = 0; i < filteringArray.length; i++) {
      if (filteringArray[i].id !== id) {
        filteredArray.push(filteringArray[i]);
      } else {
        filteredArray.push({ ...filteringArray[i], unvalid: true });
      }
    }
    return filteredArray;
  }
}
