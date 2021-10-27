import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from '../auth/auth-service.service';
import { Guest, Voucher } from '../models';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VouchersServiceService implements OnDestroy {
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
      this.useVoucherSub$$ = this.http
        .get(this.url + token)
        .subscribe((data) => {
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
        let newVouchList = this.filterVouchers(
          arrayOfGuests[i].vouchersLis,
          voucherId
        );
        updatedArray.push(
          new Guest(
            arrayOfGuests[i].id,
            arrayOfGuests[i].name,
            arrayOfGuests[i].roomNumber,
            arrayOfGuests[i].type,
            arrayOfGuests[i].validUntill,
            newVouchList,
            arrayOfGuests[i].createdDate
          )
        );
      } else {
        updatedArray.push(arrayOfGuests[i]);
      }
    }
    return updatedArray;
  }

  filterVouchers(filteringArray: Voucher[], id: string) {
    let filteredArray = [];
    let voucherNotFound = false;
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

  ngOnDestroy(): void {
    this.useVoucherSub$$.unsubscribe();
  }
}
