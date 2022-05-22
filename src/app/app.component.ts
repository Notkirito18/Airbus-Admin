import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './shared/auth/auth-service.service';
import { VouchersServiceService } from './shared/vouchers service/vouchers-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthServiceService,
    private vouchersService: VouchersServiceService,
    private router: Router
  ) {}
  ngOnInit() {
    this.authService.autoLogin();
    this.vouchersService.deleteUnvalidVouchers();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.authService.user.subscribe((user) => {
          if (user) {
            user.id === environment.adminId || user.id === environment.myAdminId
              ? this.authService.userRank.next('admin')
              : this.authService.userRank.next('vender');
          } else {
            this.authService.userRank.next('guest');
          }
        });
      }
    });
  }
}
