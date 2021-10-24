import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Guest } from 'src/app/shared/models';
import { VouchersServiceService } from 'src/app/shared/vouchers service/vouchers-service.service';

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
    private http: HttpClient
  ) {}

  usedVoucherid!: string;
  usedVoucherid$$!: Subscription;

  guest: Guest = new Guest('', '', 0, '', new Date(), []);
  guest$$!: Subscription;

  voucherExpired = false;

  ngOnInit(): void {
    this.usedVoucherid$$ = this.route.params.subscribe((params: Params) => {
      this.usedVoucherid = params['id'];
      this.guest$$ = this.http
        .get(this.vouchersService.url)
        .subscribe((data) => {
          const guestsArray = Object.values(data);
          for (let i = 0; i < guestsArray.length; i++) {
            if (guestsArray[i].id === params['id'].slice(0, 13)) {
              this.guest = guestsArray[i];
              console.log('defined guest', guestsArray[i]);
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
            ].vouchersLis.length !== 0
          ) {
            this.vouchersService.useVoucher(this.usedVoucherid);
          } else {
            this.voucherExpired = true;
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
