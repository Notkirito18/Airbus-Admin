import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { Guest, Record } from 'src/app/shared/models';
import { UsersStorageService } from 'src/app/shared/storage service/users-storage.service';
import { VouchersServiceService } from 'src/app/shared/vouchers service/vouchers-service.service';
import { GuestGeneratedComponent } from '../guest-generated/guest-generated.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit, OnDestroy {
  newGuestForm!: FormGroup;
  editingMode = false;
  guestToEdit!: Guest;
  paramsSub$$!: Subscription;

  validUntillInit = new Date(new Date().setDate(new Date().getDate() + 7));

  constructor(
    private fb: FormBuilder,
    private guestsService: UsersStorageService,
    private vouchersService: VouchersServiceService,
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newGuestForm = this.fb.group({
      name: ['', Validators.required],
      roomNumber: ['', Validators.required],
      vouchers: [21, Validators.required],
      type: ['', Validators.required],
      validUntill: ['', Validators.required],
    });

    this.paramsSub$$ = this.route.params.subscribe((params: Params) => {
      this.http
        .get('https://airbus-900f9-default-rtdb.firebaseio.com/guests.json')
        .subscribe((data) => {
          let guestsArray = Object.values(data);
          for (let i = 0; i < guestsArray.length; i++) {
            if (guestsArray[i].id === params['id']) {
              this.editingMode = true;
              this.guestToEdit = guestsArray[i];

              // init edit form
              this.newGuestForm = this.fb.group({
                name: [this.guestToEdit.name, Validators.required],
                roomNumber: [this.guestToEdit.roomNumber, Validators.required],
                vouchers: [
                  this.guestToEdit.vouchersLis.length,
                  Validators.required,
                ],
                type: [this.guestToEdit.type, Validators.required],
                validUntill: [
                  new Date(this.guestToEdit.validUntill.toString()),
                  Validators.required,
                ],
              });

              //logging
              console.log('condition met');
              console.log(
                'edit mode :',
                this.editingMode,
                '| guest to edit :',
                this.guestToEdit
              );
            }
          }
        });
    });
  }

  onSubmitForm(newGuest: any) {
    // creating new guest
    const generatedId = Date.now().toString();
    let guestToAdd = new Guest(
      generatedId,
      newGuest.name,
      newGuest.roomNumber,
      newGuest.type,
      this.addHoursToDate(newGuest.validUntill, 1),
      this.vouchersService.vouchersGenerator(
        newGuest.vouchers,
        generatedId,
        this.addHoursToDate(newGuest.validUntill, 1)
      ),
      new Date()
    );

    // creating edited guest
    if (this.editingMode) {
      let guestToUpdate = new Guest(
        this.guestToEdit.id,
        newGuest.name,
        newGuest.roomNumber,
        newGuest.type,
        this.addHoursToDate(newGuest.validUntill, 1),
        this.vouchersService.vouchersGenerator(
          newGuest.vouchers,
          this.guestToEdit.id,
          this.addHoursToDate(newGuest.validUntill, 1)
        ),
        new Date()
      );
      this.guestsService.updateGuest(this.guestToEdit.id, guestToUpdate);
      this.router.navigate(['/home']);
    }
    // pushing new guest
    else {
      console.log('new guest added', guestToAdd);
      //saving to records
      this.authService.user.pipe(take(1)).subscribe((user) => {
        const token = user.token;
        this.http
          .post(
            'https://airbus-900f9-default-rtdb.firebaseio.com/records.json?auth=' +
              token,
            new Record(new Date(), 'guest_create', guestToAdd)
          )
          .subscribe((result) => {
            console.log('registered record', result);
          });
      });

      this.guestsService.addGuest(guestToAdd);
      // openning dialog
      this.newGuestForm.reset();
      this.openGuestDialog(guestToAdd);
    }
  }

  openGuestDialog(guest: Guest): void {
    this.dialog.open(GuestGeneratedComponent, {
      width: '350px',
      data: { guest },
    });
  }

  ngOnDestroy(): void {
    this.paramsSub$$.unsubscribe();
  }
  addHoursToDate(date: Date, hours: number) {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }
}
