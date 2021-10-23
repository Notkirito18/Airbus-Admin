import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Guest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UsersStorageService {
  url = 'https://airbus-900f9-default-rtdb.firebaseio.com/guests.json';

  Guests = new Subject<Guest[]>();

  constructor(private http: HttpClient) {}

  populateGuests() {
    this.http.get(this.url).subscribe((guests: Record<string, any>) => {
      const guestsArray = Object.values(guests);
      this.Guests.next(guestsArray);
      console.log(guestsArray);
    });
  }

  addGuest(guestToAdd: Guest) {
    this.http.post(this.url, guestToAdd).subscribe(
      (response) => {
        console.log('from post', response);
        this.populateGuests();
      },
      (error) => console.log(error)
    );
  }

  removeGuest(id: string) {
    this.http.get(this.url).subscribe((data) => {
      const guestsArray = Object.values(data);
      this.http
        .put(
          this.url,
          guestsArray.filter((guest) => guest.id !== id)
        )
        .subscribe((response) => {
          console.log('from put', response);
          this.populateGuests();
        });
    });
  }

  updateGuest(id: string, guestToUpdate: Guest) {
    this.http.get(this.url).subscribe((data) => {
      let guestsArray = Object.values(data);
      for (let i = 0; i < guestsArray.length; i++) {
        if (guestsArray[i].id === id) {
          guestsArray[i] = guestToUpdate;
        }
      }
      this.http.put(this.url, guestsArray).subscribe((response) => {
        console.log('from put', response);
        this.populateGuests();
      });
    });
  }
}
