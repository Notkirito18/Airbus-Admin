import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alignment, Decoration, Margins, Table } from 'pdfmake/interfaces';
import { DeleteConfirmRecordsComponent } from 'src/app/components/delete-confirm-records/delete-confirm-records.component';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { dateShower } from 'src/app/shared/helper';
import { Record } from 'src/app/shared/models';
import { RecordsService } from 'src/app/shared/records service/records.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private recordsService: RecordsService,
    private authService: AuthServiceService
  ) {}

  loading = true;
  voucherIdToUse!: string;
  periode = 'all';
  records!: Record[];
  displayRecords!: Record[];
  disabelBtns = true;

  ngOnInit(): void {
    // getting token
    const { _token, userDataId } = this.authService.getStorageData();
    if (_token && userDataId) {
      this.recordsService.getAllRecords(_token, userDataId).subscribe(
        (records) => {
          if (records) {
            this.records = records;
            this.displayRecords = this.records;
            this.disabelBtns = false;
            this.loading = false;
          }
        },
        (error) => {
          this.loading = false;
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

  dateShower = dateShower;

  generatePdf() {
    let recordsToShow = this.records.map((item) => {
      return [
        item.guestName,
        item.type === 'voucher_use' ? 'Voucher used' : 'Guest Created',
        item.date.toString().slice(0, 10),
        item.date.toString().slice(11, 19),
      ];
    });
    let totalV = 0;
    let totalG = 0;
    for (let i = 0; i < recordsToShow.length; i++) {
      if (recordsToShow[i][1] === 'Voucher used') {
        totalV += 1;
      } else {
        totalG += 1;
      }
    }
    let now = new Date();
    let oldestRecordDate = new Date();
    for (let i = 0; i < this.records.length - 1; i++) {
      if (
        new Date(this.records[i].date).getTime() <
        new Date(this.records[i + 1].date).getTime()
      ) {
        oldestRecordDate = this.records[i].date;
      }
    }
    let sevenDaysAgoDate = new Date(now.setDate(now.getDate() - 7));
    let monthAgoDate = new Date(now.setDate(now.getDate() - 30));
    let docDefinition = {
      content: [
        {
          text: 'Vouchy QR',
          fontSize: 18,
          alignment: 'center' as Alignment,
          color: '#6e6e6e',
        },
        {
          text: 'VOUCHERS RECORDS',
          fontSize: 20,
          bold: true,
          color: '#b91f70',
          alignment: 'center' as Alignment,
        },
        {
          text: 'Records period',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: 'From',
                bold: true,
              },
              {
                text:
                  this.periode === 'all'
                    ? this.dateShower(oldestRecordDate)
                    : this.periode === 'lastWeek'
                    ? this.dateShower(sevenDaysAgoDate)
                    : this.dateShower(monthAgoDate),
              },
            ],
            [
              {
                text: 'To',
                bold: true,
              },
              {
                text: this.dateShower(new Date()),
              },
            ],
          ],
        },
        {
          text: 'Records :',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto'],
            body: [['Guest', 'Action', 'Date', 'Time']].concat(recordsToShow),
          } as Table,
        },
        {
          text: 'Totals',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                columns: [
                  [
                    { text: 'Total vouchers used:' },
                    { text: 'Total guests created' },
                  ],
                  [
                    { text: totalV, bold: true },
                    { text: totalG, bold: true },
                  ],
                ],
              },
            ],
            [
              {
                text: 'Signature',
                alignment: 'right' as Alignment,
                italics: true,
              },
            ],
          ],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline' as Decoration,
          fontSize: 14,
          margin: [0, 15, 0, 15] as Margins,
        },
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }

  openDeleteGuestDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmRecordsComponent, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const { _token, userDataId } = this.authService.getStorageData();
        const ids: string[] = this.records.map((item) => item._id);
        this.recordsService
          .removeManyRecords(ids, _token, userDataId)
          .subscribe(
            (res) => {
              this.authService.notification.next({
                msg: 'Records Deleted',
                type: 'notError',
              });
            },
            (error) => {
              this.authService.notification.next({
                msg: error.error.msg,
                type: 'error',
              });
            }
          );
      }
    });
  }
}
