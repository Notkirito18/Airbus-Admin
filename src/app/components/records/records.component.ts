import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Guest, Record } from 'src/app/shared/models';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
  @Input() userRank!: string;

  @Input() guest!: Guest;

  recordsLength = 0;

  constructor(private http: HttpClient) {}

  records!: Record[];

  ngOnInit(): void {
    this.http
      .get('https://airbus-900f9-default-rtdb.firebaseio.com/records.json')
      .subscribe((result) => {
        if (result) {
          const recordsArr = Object.values(result);
          if (this.userRank === 'vender') {
            this.records = recordsArr.filter((item) => {
              return item.type === 'voucher_use';
            });
            this.recordsLength = this.records.length;
          } else if (this.userRank === 'guest') {
            console.log('im filtering for guest');
            this.records = recordsArr.filter((item) => {
              return (
                item.type === 'voucher_use' &&
                item.Voucher?.holderId === this.guest.id
              );
            });
            this.recordsLength = this.records.length;
          } else {
            this.records = recordsArr;
            this.recordsLength = this.records.length;
          }
        }
      });
  }
}
