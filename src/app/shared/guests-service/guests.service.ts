import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Guest, GuestAddObject, Record } from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GuestsService {
  constructor(private http: HttpClient) {}

  getAllGuests(token: string, userDataId: string): Observable<Guest[]> {
    return this.http
      .get<{ guests: Guest[] }>('api/guests', {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      })
      .pipe(
        map((responseGuests) => {
          return responseGuests.guests;
        })
      );
  }

  getGuestById(_id: string): Observable<Guest> {
    return this.http
      .get<{ guest: Guest }>('api/guest/' + _id, {
        headers: {
          key: environment.serverKey,
        },
      })
      .pipe(
        map((responseGuest) => {
          return responseGuest.guest;
        })
      );
  }

  getGuestRecords(_id: string): Observable<Record[]> {
    return this.http
      .get<{ guest: Guest; records: Record[] }>('api/guest/' + _id, {
        headers: {
          key: environment.serverKey,
        },
      })
      .pipe(
        map((responseGuest) => {
          return responseGuest.records;
        })
      );
  }

  addGuest(
    guestToAdd: GuestAddObject,
    token: string,
    userDataId: string
  ): Observable<Guest> {
    return this.http
      .post<{ guest: Guest }>('api/guests', guestToAdd, {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      })
      .pipe(
        map((responseGuest) => {
          return responseGuest.guest;
        })
      );
  }

  updateGuest(
    _id: string,
    updatedGuest: any,
    token: string,
    userDataId: string
  ): Observable<Guest> {
    return this.http
      .patch<{ guest: Guest }>('api/guests/' + _id, updatedGuest, {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      })
      .pipe(
        map((responseGuest) => {
          return responseGuest.guest;
        })
      );
  }

  removeGuest(_id: string, token: string, userDataId: string) {
    return this.http.delete('api/guests/' + _id, {
      headers: {
        key: environment.serverKey,
        authToken: token,
        userDataId: userDataId,
      },
    });
  }

  //*delete all unvalid vouchers
  deleteUnvalidVouchers(token: string, userDataId: string) {
    // getting guests

    return this.http
      .get<{ guests: Guest[] }>('api/guests', {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      })
      .pipe(
        mergeMap((result: { guests: Guest[] }) => {
          // finding expired vouchers
          const ids: string[] = [];
          result.guests.forEach((guest: Guest) => {
            const newDate = new Date();
            const expireDate = new Date(guest.validUntill);
            if (newDate.getTime() > expireDate.getTime()) {
              ids.push(guest._id);
            }
          });
          console.log('ids baby', ids);

          // updating data
          return this.http.patch('api/unvalidateExpired', ids, {
            headers: {
              key: environment.serverKey,
              authToken: token,
              userDataId: userDataId,
            },
          });
        })
      );
  }
}
