import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Guest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UsersStorageService implements OnDestroy {
  Guests = new Subject<Guest[]>();

  populateGuestsSub$$!: Subscription;
  addGuestSub$$!: Subscription;
  removeGuestSub$$!: Subscription;
  removeGuestPutSub$$!: Subscription;
  updateGuest$$!: Subscription;
  updateGuestPutSub$$!: Subscription;

  url = 'https://airbus-900f9-default-rtdb.firebaseio.com/guests.json';

  constructor(private http: HttpClient) {}

  populateGuests() {
    console.log('got token');
    this.populateGuestsSub$$ = this.http
      .get(this.url)
      .subscribe((guests: Record<string, any>) => {
        const guestsArray = Object.values(guests);
        this.Guests.next(guestsArray);
      });
  }

  addGuest(guestToAdd: Guest) {
    console.log('got token');
    this.addGuestSub$$ = this.http.post(this.url, guestToAdd).subscribe(
      (response) => {
        this.populateGuests();
      },
      (error) => console.log(error)
    );
  }

  removeGuest(id: string) {
    console.log('got token');
    this.removeGuestSub$$ = this.http.get(this.url).subscribe((data) => {
      const guestsArray = Object.values(data);
      this.removeGuestPutSub$$ = this.http
        .put(
          this.url,
          guestsArray.filter((guest) => guest.id !== id)
        )
        .subscribe((response) => {
          this.populateGuests();
        });
    });
  }

  updateGuest(id: string, guestToUpdate: Guest) {
    console.log('got token');
    this.updateGuest$$ = this.http.get(this.url).subscribe((data) => {
      let guestsArray = Object.values(data);
      for (let i = 0; i < guestsArray.length; i++) {
        if (guestsArray[i].id === id) {
          guestsArray[i] = guestToUpdate;
        }
      }
      this.updateGuestPutSub$$ = this.http
        .put(this.url, guestsArray)
        .subscribe((response) => {
          this.populateGuests();
        });
    });
  }

  ngOnDestroy(): void {
    this.populateGuestsSub$$.unsubscribe();
    this.addGuestSub$$.unsubscribe();
    this.removeGuestSub$$.unsubscribe();
    this.updateGuest$$.unsubscribe();
    this.removeGuestPutSub$$.unsubscribe();
    this.updateGuestPutSub$$.unsubscribe();
  }
}
