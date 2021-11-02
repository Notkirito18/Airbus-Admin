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
    private vouchersService: VouchersServiceService,
    private authService: AuthServiceService,
    private http: HttpClient
  ) {}

  voucherUsed!: Voucher;

  loading = true;

  usedVoucherid!: string;
  usedVoucherid$$!: Subscription;

  guest: Guest = new Guest('', '', 0, '', new Date(), []);
  guest$$!: Subscription;

  savingRecordSub$$!: Subscription;

  voucherExpired!: string;

  token!: string;

  admin = false;

  ngOnInit(): void {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      const token = user.token;
      this.token = user.token;
      if (user.id === 'G6QOm6b35tUUUz5sZrH3bo0oi3y2') {
        this.admin = true;
      }
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
            }
          }
          for (let i = 0; i < this.guest.vouchersLis.length; i++) {
            if (this.guest.vouchersLis[i].id === this.usedVoucherid) {
              this.voucherUsed = this.guest.vouchersLis[i];
            }
          }

          // ckecking availibility

          let voucherExist = false;
          this.http
            .get('https://airbus-900f9-default-rtdb.firebaseio.com/guests.json')
            .subscribe((data) => {
              const guestsArray = Object.values(data);
              for (let i = 0; i < guestsArray.length; i++) {
                for (let j = 0; j < guestsArray[i].vouchersLis.length; j++) {
                  if (guestsArray[i].vouchersLis[j].id === params['id']) {
                    voucherExist = true;
                  }
                }
              }
              if (!voucherExist) {
                this.voucherExpired = 'expired';
              } else if (!this.token) {
                this.voucherExpired = 'notAuth';
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
                  .subscribe();
                this.vouchersService.useVoucher(this.usedVoucherid);
                this.voucherExpired = 'no';
              }
              this.loading = false;
            });
        });
    });
  }
  ngOnDestroy(): void {
    this.usedVoucherid$$.unsubscribe();
    this.guest$$.unsubscribe();
  }
}
