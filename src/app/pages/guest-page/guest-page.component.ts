import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { GuestsService } from 'src/app/shared/guests-service/guests.service';
import { filterValidVouchers } from 'src/app/shared/helper';
import { Guest, Record } from 'src/app/shared/models';
import { RecordsService } from 'src/app/shared/records service/records.service';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss'],
})
export class GuestPageComponent implements OnInit {
  guest: Guest = new Guest('', '', 0, '', new Date(), []);
  // guest!: Guest;
  guestHasNoValidVouchers = false;
  loading = true;
  displayRecords!: Record[];

  constructor(
    private route: ActivatedRoute,
    private guestsServie: GuestsService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    // getting guest id
    this.route.params.subscribe((params: Params) => {
      const guestId = params['id'];
      // getting guest info
      this.guestsServie.getGuestById(guestId).subscribe(
        (guest: Guest) => {
          this.guest = guest;
          // checking if the guest has valid vouchers
          if (filterValidVouchers(guest.vouchersLis).length == 0) {
            this.guestHasNoValidVouchers = true;
          }
        },
        (error) => {
          this.authService.notification.next({
            msg: error.error.msg,
            type: 'error',
          });
        }
      );
      // getting guest's records
      this.guestsServie.getGuestRecords(guestId).subscribe(
        (records: Record[]) => {
          this.displayRecords = records;
          this.loading = false;
        },
        (error) => {
          this.authService.notification.next({
            msg: error.error.msg,
            type: 'error',
          });
        }
      );
    });
  }
  filterValidVouchers = filterValidVouchers;
}
