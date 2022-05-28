import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { Record } from 'src/app/shared/models';
import { RecordsService } from 'src/app/shared/records service/records.service';

@Component({
  selector: 'app-vender-home',
  templateUrl: './vender-home.component.html',
  styleUrls: ['./vender-home.component.scss'],
})
export class VenderHomeComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private recordsService: RecordsService
  ) {}
  voucherIdToUse!: string;
  loading = true;

  periode = 'all';
  records!: Record[];
  displayRecords!: Record[];

  ngOnInit(): void {
    // getting token
    const { _token, userDataId } = this.authService.getStorageData();
    if (_token && userDataId) {
      this.recordsService.getAllRecords(_token, userDataId).subscribe(
        (records) => {
          if (records) {
            this.records = records;
            this.displayRecords = this.records;
            console.log('got records :', this.records);
            this.loading = false;
          }
        },
        (error) => {
          this.authService.notification.next({
            msg: error.error.msg,
            type: 'error',
          });
        }
      );
    } else {
      this.router.navigate(['/auth']);
    }
  }

  selectChange() {
    if (this.periode === 'all') {
      this.displayRecords = this.records;
    }
    if (this.periode === 'lastWeek') {
      this.displayRecords = this.records.filter((item) => {
        return new Date(item.date).getTime() > new Date().getTime() - 604800000;
      });
    }
    if (this.periode === 'lastMonth') {
      this.displayRecords = this.records.filter((item) => {
        return (
          new Date(item.date).getTime() > new Date().getTime() - 2629800000
        );
      });
    }
  }

  useVoucherClick() {
    this.router.navigate(['/using/' + this.voucherIdToUse]);
  }
}
