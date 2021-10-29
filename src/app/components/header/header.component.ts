import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user!: User;
  userSub$$!: Subscription;
  userRankSub$$!: Subscription;
  admin = false;
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub$$ = this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.userRankSub$$ = this.authService.userRank.subscribe((userRank) => {
      if (userRank === 'admin') {
        this.admin = true;
      } else {
        this.admin = false;
      }
    });
  }

  onLoginClick() {
    this.router.navigate(['/auth']);
  }
  onLogoutClick() {
    this.authService.logOut();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    this.userSub$$.unsubscribe();
  }
}
