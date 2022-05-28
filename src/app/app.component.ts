import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from './shared/auth/auth-service.service';
import { VouchersService } from './shared/vouchers service/vouchers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthServiceService,
    private vouchersService: VouchersService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  notifier$!: Subscription;

  ngOnInit() {
    //error notifier
    this.notifier$ = this.authService.notification.subscribe(
      ({ msg, type }) => {
        this.snackBar.open(msg, '', {
          duration: 4000,
          panelClass: type,
        });
      }
    );
    //auto login
    this.authService.autoLogin();
    //auto delete expired vouchers
    this.vouchersService.deleteUnvalidVouchers();
    //getting user rank
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.authService.user.subscribe((user) => {
          if (user) {
            user.admin
              ? this.authService.userRank.next('admin')
              : this.authService.userRank.next('vender');
          } else {
            this.authService.userRank.next('guest');
          }
        });
      }
    });
  }
  ngOnDestroy(): void {
    if (this.notifier$) this.notifier$.unsubscribe();
  }
}
