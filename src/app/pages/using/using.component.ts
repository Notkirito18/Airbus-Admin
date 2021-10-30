import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { Guest, Record, Voucher } from 'src/app/shared/models';
import { VouchersServiceService } from 'src/app/shared/vouchers service/vouchers-service.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-using',
  templateUrl: './using.component.html',
  styleUrls: ['./using.component.scss'],
})
export class UsingComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vouchersService: VouchersServiceService,
    private authService: AuthServiceService,
    private http: HttpClient
  ) {}

  voucherUsed!: Voucher;

  usedVoucherid!: string;
  usedVoucherid$$!: Subscription;

  guest: Guest = new Guest('', '', 0, '', new Date(), []);
  guest$$!: Subscription;

  savingRecordSub$$!: Subscription;

  voucherExpired!: string;

  token!: string;

  ngOnInit(): void {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      const token = user.token;
      this.token = user.token;
    });

    this.usedVoucherid$$ = this.route.params.subscribe((params: Params) => {
      this.usedVoucherid = params['id'];
      this.guest$$ = this.http
        .get('https://airbus-900f9-default-rtdb.firebaseio.com/guests.json')
        .subscribe((data) => {
          const guestsArray = Object.values(data);
          for (let i = 0; i < guestsArray.length; i++) {
            if (guestsArray[i].id === params['id'].slice(0, 13)) {
              this.guest = guestsArray[i];
              console.log('defined guest', guestsArray[i]);
            }
          }
          for (let i = 0; i < this.guest.vouchersLis.length; i++) {
            if (this.guest.vouchersLis[i].id === this.usedVoucherid) {
              this.voucherUsed = this.guest.vouchersLis[i];
            }
          }

          // ckecking availibility
          let indexOfGuest = this.vouchersService.indexOfGuestFromId(
            guestsArray,
            params['id'].slice(0, 13)
          );
          if (
            this.vouchersService.deleteVoucher(guestsArray, params['id'])[
              indexOfGuest
            ].vouchersLis.length === 0
          ) {
            this.voucherExpired = 'expired';
            console.log('expired');
          } else if (!this.token) {
            this.voucherExpired = 'notAuth';
            console.log('notAuth', 'token', this.token);
          } else {
            // saving record of usage
            this.http
              .post(
                'https://airbus-900f9-default-rtdb.firebaseio.com/records.json?auth=' +
                  this.token,
                new Record(
                  new Date(),
                  'voucher_use',
                  this.guest,
                  this.voucherUsed
                )
              )
              .subscribe((result) => {
                console.log('registered record', result);
              });
            this.vouchersService.useVoucher(this.usedVoucherid);
            this.voucherExpired = 'no';
            console.log('no');
          }
        });
    });
  }
  seeMyVouchers() {
    this.router.navigate(['/guest/' + this.guest.id]);
  }
  ngOnDestroy(): void {
    this.usedVoucherid$$.unsubscribe();
    this.guest$$.unsubscribe();
  }
}
