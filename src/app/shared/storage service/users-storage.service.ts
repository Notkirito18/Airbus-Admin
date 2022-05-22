import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AuthServiceService } from '../auth/auth-service.service';
import { Guest } from '../models';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersStorageService implements OnDestroy {
  Guests = new Subject<Guest[]>();
  token!: string | any;

  populateGuestsSub$$!: Subscription;
  addGuestSub$$!: Subscription;
  removeGuestSub$$!: Subscription;
  updateGuest$$!: Subscription;

  url = 'https://airbus-900f9-default-rtdb.firebaseio.com/guests.json?auth=';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  populateGuests() {
    this.populateGuestsSub$$ = this.authService.user
      .pipe(take(1))
      .subscribe((user) => {
        this.token = user.token;
        const token = user.token;
        this.http
          .get(this.url + token)
          .subscribe((guests: Record<string, any>) => {
            const guestsArray = Object.values(guests);
            this.Guests.next(guestsArray);
          });
      });
  }

  addGuest(guestToAdd: Guest) {
    this.addGuestSub$$ = this.authService.user
      .pipe(take(1))
      .subscribe((user) => {
        this.token = user.token;
        const token = user.token;
        console.log('got token');
        this.http.post(this.url + token, guestToAdd).subscribe(
          (response) => {
            this.populateGuests();
          },
          (error) => console.log(error)
        );
      });
  }

  removeGuest(id: string) {
    this.removeGuestSub$$ = this.authService.user
      .pipe(take(1))
      .subscribe((user) => {
        this.token = user.token;
        const token = user.token;
        console.log('got token');
        this.http.get(this.url + token).subscribe((data) => {
          const guestsArray = Object.values(data);
          this.http
            .put(
              this.url + token,
              guestsArray.filter((guest) => guest.id !== id)
            )
            .subscribe((response) => {
              this.populateGuests();
            });
        });
      });
  }

  updateGuest(id: string, guestToUpdate: Guest) {
    this.updateGuest$$ = this.authService.user
      .pipe(take(1))
      .subscribe((user) => {
        this.token = user.token;
        const token = user.token;
        console.log('got token');
        this.http.get(this.url + token).subscribe((data) => {
          let guestsArray = Object.values(data);
          for (let i = 0; i < guestsArray.length; i++) {
            if (guestsArray[i].id === id) {
              guestsArray[i] = guestToUpdate;
            }
          }
          this.http.put(this.url + token, guestsArray).subscribe((response) => {
            this.populateGuests();
          });
        });
      });
  }

  ngOnDestroy(): void {
    if (this.populateGuestsSub$$) {
      this.populateGuestsSub$$.unsubscribe();
    }
    if (this.addGuestSub$$) {
      this.addGuestSub$$.unsubscribe();
    }
    if (this.removeGuestSub$$) {
      this.removeGuestSub$$.unsubscribe();
    }
    if (this.updateGuest$$) {
      this.updateGuest$$.unsubscribe();
    }
  }
}
