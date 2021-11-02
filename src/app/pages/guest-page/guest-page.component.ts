import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Guest } from 'src/app/shared/models';
import { RecordsService } from 'src/app/shared/records service/records.service';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss'],
})
export class GuestPageComponent implements OnInit {
  guest: Guest = new Guest('', '', 0, '', new Date(), []);
  guestHasNoValidVouchers = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.http
        .get('https://airbus-900f9-default-rtdb.firebaseio.com/guests.json')
        .subscribe((data) => {
          const guestsArray = Object.values(data);

          for (let i = 0; i < guestsArray.length; i++) {
            if (guestsArray[i].id === params['id']) {
              this.guest = guestsArray[i];
              if (this.guest.vouchersLis[0].id.length < 1) {
                this.guestHasNoValidVouchers = true;
              }
            }
          }
          this.loading = false;
        });
    });
    this.http
      .get('https://airbus-900f9-default-rtdb.firebaseio.com/records.json')
      .subscribe((recordsData) => {
        if (recordsData) {
          const recordsArr = Object.values(recordsData);
          let GuestRecords = [];
          for (let i = 0; i < recordsArr.length; i++) {
            if (recordsArr[i].guest.id === this.guest.id) {
              GuestRecords.push(recordsArr[i]);
            }
          }
          this.recordsService.recordsArray.next(GuestRecords);
        }
      });
  }
  testFun() {
    this.loading = false;
  }
}
