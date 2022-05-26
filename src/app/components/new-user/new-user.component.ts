import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Guest,
  GuestAddObject,
  Record,
  RecordAddObject,
} from 'src/app/shared/models';
import { GuestGeneratedComponent } from '../guest-generated/guest-generated.component';
import { GuestsService } from 'src/app/shared/guests-service/guests.service';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { RecordsService } from 'src/app/shared/records service/records.service';
import { filterValidVouchers } from 'src/app/shared/helper';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {
  newGuestForm!: FormGroup;
  editingMode = false;
  guestToEdit!: Guest;
  guestAdded!: Guest;
  loading: boolean = true;

  validUntillInit = new Date(new Date().setDate(new Date().getDate() + 7));

  constructor(
    private fb: FormBuilder,
    private guestsService: GuestsService,
    private authService: AuthServiceService,
    private recordsService: RecordsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      //setting mode
      if (params['id'] != 'new') {
        this.editingMode = true;
      } else {
        this.editingMode = false;
      }
      // initialing the new guest form
      if (!this.editingMode) {
        //TODO match validation with backend
        this.newGuestForm = this.fb.group({
          name: ['', [Validators.required, Validators.minLength(3)]],
          roomNumber: ['', Validators.required],
          vouchers: ['', Validators.required],
          type: ['', Validators.required],
          validUntill: ['', Validators.required],
        });
        this.loading = false;
      } else {
        // getting token
        const { _token, userDataId } = this.authService.getStorageData();
        if (_token && userDataId) {
          // initialing the editing guest form
          this.guestsService
            .getGuestById(params['id'], _token, userDataId)
            .subscribe(
              (guest: Guest) => {
                this.newGuestForm = this.fb.group({
                  name: [guest.name, Validators.required],
                  roomNumber: [guest.roomNumber, Validators.required],
                  vouchers: [
                    filterValidVouchers(guest.vouchersLis).length,
                    Validators.required,
                  ],
                  type: [guest.type, Validators.required],
                  validUntill: [
                    new Date(guest.validUntill.toString()),
                    Validators.required,
                  ],
                });
                // initialing guestToEdit variable
                this.guestToEdit = guest;
                this.loading = false;
              },
              (error) => {
                console.log(error);
              }
            );
        }
      }
    });
  }

  onSubmitForm(newGuest: any) {
    // fixing vouchers and validUntill
    const validUntill = this.addHoursToDate(newGuest.validUntill, 1);
    let vouchers = [];
    for (let i = 0; i < newGuest.vouchers; i++) {
      vouchers.push({ validUntill });
    }
    // creating new guest
    let guestToAdd: GuestAddObject = {
      name: newGuest.name,
      roomNumber: newGuest.roomNumber,
      type: newGuest.type,
      validUntill: validUntill,
      vouchersLis: vouchers,
    };
    // getting token
    const { _token, userDataId } = this.authService.getStorageData();
    if (_token && userDataId) {
      if (!this.editingMode) {
        // adding new guest to db
        this.guestsService.addGuest(guestToAdd, _token, userDataId).subscribe(
          (guest: Guest) => {
            this.guestAdded = guest;
            const recordToAdd: RecordAddObject = {
              date: new Date(),
              type: 'guest_created',
              guestId: guest._id,
              guestName: guest.name,
              userDataId: userDataId,
            };
            this.recordsService
              .addRecord(recordToAdd, _token, userDataId)
              .subscribe(
                (record) => {
                  console.log('record added', record);
                },
                (error) => {
                  console.log(error);
                }
              );
            // openning dialog
            this.newGuestForm.reset();
            this.openGuestDialog(this.guestAdded);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        // editing guest in db
        this.route.params.subscribe((params: Params) => {
          this.guestsService
            .updateGuest(params['id'], guestToAdd, _token, userDataId)
            .subscribe(
              (guest: Guest) => {
                this.guestAdded = guest;
                // openning dialog
                this.newGuestForm.reset();
                this.openGuestDialog(this.guestAdded);
              },
              (error) => {
                console.log(error);
              }
            );
        });
      }
    }
  }

  openGuestDialog(guest: Guest): void {
    this.dialog.open(GuestGeneratedComponent, {
      width: '350px',
      data: { guest },
    });
  }
  addHoursToDate(date: Date, hours: number) {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }
  filterValidVouchers = filterValidVouchers;
}
