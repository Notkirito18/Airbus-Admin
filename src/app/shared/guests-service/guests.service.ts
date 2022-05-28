import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Guest, GuestAddObject } from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuestsService {
  constructor(private http: HttpClient) {}

  getAllGuests(token: string, userDataId: string): Observable<Guest[]> {
    return this.http
      .get<{ guests: Guest[] }>(environment.serverUrl + 'api/guests', {
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

  getGuestById(
    _id: string,
    token: string,
    userDataId: string
  ): Observable<Guest> {
    return this.http
      .get<{ guest: Guest }>(environment.serverUrl + 'api/guests/' + _id, {
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

  addGuest(
    guestToAdd: GuestAddObject,
    token: string,
    userDataId: string
  ): Observable<Guest> {
    return this.http
      .post<{ guest: Guest }>(
        environment.serverUrl + 'api/guests',
        guestToAdd,
        {
          headers: {
            key: environment.serverKey,
            authToken: token,
            userDataId: userDataId,
          },
        }
      )
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
      .patch<{ guest: Guest }>(
        environment.serverUrl + 'api/guests/' + _id,
        updatedGuest,
        {
          headers: {
            key: environment.serverKey,
            authToken: token,
            userDataId: userDataId,
          },
        }
      )
      .pipe(
        map((responseGuest) => {
          return responseGuest.guest;
        })
      );
  }

  removeGuest(_id: string, token: string, userDataId: string) {
    return this.http.delete(environment.serverUrl + 'api/guests/' + _id, {
      headers: {
        key: environment.serverKey,
        authToken: token,
        userDataId: userDataId,
      },
    });
  }
}
