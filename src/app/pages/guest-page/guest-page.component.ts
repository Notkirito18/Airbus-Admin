import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Guest } from 'src/app/shared/models';
import { VouchersServiceService } from 'src/app/shared/vouchers service/vouchers-service.service';
import { take } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss'],
})
export class GuestPageComponent implements OnInit, OnDestroy {
  guest: Guest = new Guest('', '', 0, '', new Date(), []);

  gettingGuestSub$!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private vouchersService: VouchersServiceService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.gettingGuestSub$ = this.route.params.subscribe((params: Params) => {
      this.http
        .get('https://airbus-900f9-default-rtdb.firebaseio.com/guests.json')
        .subscribe((data) => {
          const guestsArray = Object.values(data);
          for (let i = 0; i < guestsArray.length; i++) {
            if (guestsArray[i].id === params['id']) {
              this.guest = guestsArray[i];
            }
          }
        });
    });
  }

  useVoucher(id: string) {
    this.router.navigate(['/using/' + id]);
  }
  ngOnDestroy() {
    this.gettingGuestSub$.unsubscribe();
  }
}
