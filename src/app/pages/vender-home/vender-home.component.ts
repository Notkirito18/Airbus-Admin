import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private http: HttpClient,
    private recordsService: RecordsService
  ) {}
  voucherIdToUse!: string;

  periode = 'all';
  records!: Record[];
  displayRecords!: Record[];

  ngOnInit(): void {
    this.http
      .get('https://airbus-900f9-default-rtdb.firebaseio.com/records.json')
      .subscribe((result) => {
        if (result) {
          const recordsArr = Object.values(result);
          this.records = recordsArr;
          this.recordsService.recordsArray.next(this.records);
        }
      });
  }

  selectChange() {
    if (this.periode === 'all') {
      this.recordsService.recordsArray.next(this.records);
    }
    if (this.periode === 'lastWeek') {
      this.displayRecords = this.records.filter((item) => {
        return new Date(item.date).getTime() > new Date().getTime() - 604800000;
      });
      this.recordsService.recordsArray.next(this.displayRecords);
    }
    if (this.periode === 'lastMonth') {
      this.displayRecords = this.records.filter((item) => {
        return (
          new Date(item.date).getTime() > new Date().getTime() - 2629800000
        );
      });
      this.recordsService.recordsArray.next(this.displayRecords);
    }
  }

  useVoucherClick() {
    this.router.navigate(['/using/' + this.voucherIdToUse]);
  }
}
