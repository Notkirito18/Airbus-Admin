import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guest, Voucher } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VouchersServiceService {
  url = 'https://airbus-900f9-default-rtdb.firebaseio.com/guests.json';
  constructor(private http: HttpClient) {}

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
    console.log(generatedVouchers);
    return generatedVouchers;
  }

  useVoucher(voucherId: string) {
    this.http.get(this.url).subscribe((data) => {
      const guestsArray = Object.values(data);
      this.http
        .put(this.url, this.deleteVoucher(guestsArray, voucherId))
        .subscribe((response) => {
          console.log('response :', response);
        });
    });
  }

  deleteVoucher(arrayOfGuests: Guest[], voucherId: string) {
    let updatedArray: Guest[] = [];
    let guestId = voucherId.slice(0, 13);
    console.log(guestId);
    for (let i = 0; i < arrayOfGuests.length; i++) {
      if (arrayOfGuests[i].id === guestId) {
        console.log('foundGuestId', arrayOfGuests[i].vouchersLis);

        console.log(voucherId);
        let newVouchList = this.filterVouchers(
          arrayOfGuests[i].vouchersLis,
          voucherId
        );
        console.log(
          'filteredArr',
          this.filterVouchers(arrayOfGuests[i].vouchersLis, voucherId)
        );
        updatedArray.push(
          new Guest(
            arrayOfGuests[i].id,
            arrayOfGuests[i].name,
            arrayOfGuests[i].roomNumber,
            arrayOfGuests[i].type,
            arrayOfGuests[i].vouchers,
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

  filterVouchers(array: Voucher[], id: string) {
    let filteredArray = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].id !== id) {
        filteredArray.push(array[i]);
      }
    }
    return filteredArray;
  }
}
