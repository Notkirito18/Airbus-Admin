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
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GuestsService } from 'src/app/shared/guests-service/guests.service';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';

@Component({
  selector: 'app-qr-code-info',
  templateUrl: './qr-code-info.component.html',
  styleUrls: ['./qr-code-info.component.scss'],
})
export class QrCodeInfoComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private guestsService: GuestsService,
    private authService: AuthServiceService,
    public dialogRef: MatDialogRef<QrCodeInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { voucher: Voucher }
  ) {}

  holder: Guest = new Guest('', '', 0, '', new Date(), []);
  getolderSub$$!: Subscription;

  ngOnInit(): void {
    //get token
    const { _token, userDataId } = this.authService.getStorageData();
    this.guestsService.getGuestById(this.data.voucher.holderId).subscribe(
      (guest: Guest) => {
        this.holder = guest;
      },
      (error) => {
        this.authService.notification.next({
          msg: error.error.msg,
          type: 'error',
        });
      }
    );
  }

  @ViewChild('qrcode', { static: false }) qrcode!: ElementRef;

  ngAfterViewInit() {
    // Options
    var options = {
      text: environment.serverUrl + 'using/' + this.data.voucher._id,
      width: 250,
      height: 250,
      colorDark: '#440024',
      colorLight: '#ffffff',
      logo: '../../../assets/aloftC.png',
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
    this.router.navigate(['/dashboard']);
  }
  responsiveWidth = responsiveWidth;
}
