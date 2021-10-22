import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Guest } from 'src/app/shared/models';
import { UsersStorageService } from 'src/app/shared/storage service/users-storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  guestsToShow!: Guest[];
  guestsToShow$$!: Subscription;

  constructor(private guestsService: UsersStorageService) {}

  ngOnInit(): void {
    this.guestsToShow$$ = this.guestsService.Guests.subscribe(
      (guests: Guest[]) => {
        this.guestsToShow = guests;
        console.log('nexted', this.guestsToShow);
      }
    );
    this.guestsService.populateGuests();
  }

  removeGuest(id: string) {
    this.guestsService.removeGuest(id);
  }

  onEdit(guestToEdit: Guest) {
    const editedGuest = new Guest(
      guestToEdit.id,
      guestToEdit.name,
      guestToEdit.roomNumber,
      guestToEdit.type,
      5,
      guestToEdit.vouchersValidUntill
    );
    this.guestsService.updateGuest(guestToEdit.id, editedGuest);
  }

  ngOnDestroy() {
    this.guestsToShow$$.unsubscribe();
  }
}
