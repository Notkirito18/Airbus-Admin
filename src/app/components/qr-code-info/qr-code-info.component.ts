import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Guest, Voucher } from 'src/app/shared/models';
import QRCode from 'easyqrcodejs';
import { responsiveWidth } from 'src/app/shared/helper';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { VouchersServiceService } from 'src/app/shared/vouchers service/vouchers-service.service';

@Component({
  selector: 'app-qr-code-info',
  templateUrl: './qr-code-info.component.html',
  styleUrls: ['./qr-code-info.component.scss'],
})
export class QrCodeInfoComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthServiceService,
    private vouchersService: VouchersServiceService,
    public dialogRef: MatDialogRef<QrCodeInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { voucher: Voucher }
  ) {}

  holder: Guest = new Guest('', '', 0, '', new Date(), []);
  getolderSub$$!: Subscription;

  ngOnInit(): void {
    this.http
      .get('https://airbus-900f9-default-rtdb.firebaseio.com/guests.json')
      .subscribe((guests: Record<string, any>) => {
        const guestsArray = Object.values(guests);
        for (let i = 0; i < guestsArray.length; i++) {
          if (guestsArray[i].id === this.data.voucher.holderId) {
            this.holder = guestsArray[i];
          }
        }
      });
  }

  @ViewChild('qrcode', { static: false }) qrcode!: ElementRef;

  ngAfterViewInit() {
    // Options
    var options = {
      text:
        'https://airbus-900f9.firebaseapp.com/using/' + this.data.voucher.id,
      width: 250,
      height: 250,
      colorDark: '#440024',
      colorLight: '#ffffff',
      logo: '../../../assets/aloftC-01.png',
    };

    // Create new QRCode Object
    new QRCode(this.qrcode.nativeElement, options);
  }

  goToGuestPage(id: string) {
    this.dialogRef.close();
    this.router.navigate(['/guest/' + id]);
  }
  homePage() {
    this.dialogRef.close();
    this.router.navigate(['/home']);
  }
  responsiveWidth = responsiveWidth;
}
