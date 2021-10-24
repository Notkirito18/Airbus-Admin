import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Guest } from 'src/app/shared/models';
import { VouchersServiceService } from 'src/app/shared/vouchers service/vouchers-service.service';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss'],
})
export class GuestPageComponent implements OnInit {
  guest: Guest = new Guest('', '', 0, '', new Date(), []);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private vouchersService: VouchersServiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.http.get(this.vouchersService.url).subscribe((data) => {
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
    console.log('clicked', id);
    this.router.navigate(['/using/' + id]);
  }
}
