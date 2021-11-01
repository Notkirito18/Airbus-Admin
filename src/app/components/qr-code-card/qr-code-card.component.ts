import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import QRCode from 'easyqrcodejs';
import { Subscription } from 'rxjs';
import { Voucher } from 'src/app/shared/models';
import { QrCodeInfoComponent } from '../qr-code-info/qr-code-info.component';
@Component({
  selector: 'app-qr-code-card',
  templateUrl: './qr-code-card.component.html',
  styleUrls: ['./qr-code-card.component.scss'],
})
export class QrCodeCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() voucher!: Voucher;
  @Input() index!: number;

  constructor(
    private dialog: MatDialog,
    private mediaObserver: MediaObserver
  ) {}

  mediaSubscription!: Subscription;
  screenSize = 'lg';

  ngOnInit(): void {
    this.mediaSubscription = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.screenSize = result.mqAlias;
      }
    );
  }

  @ViewChild('qrcode', { static: false }) qrcode!: ElementRef;

  ngAfterViewInit() {
    // Options
    var options = {
      text: 'https://airbus-900f9.firebaseapp.com/using/' + this.voucher.id,
      width: 150,
      height: 150,
      colorDark: '#440024',
      colorLight: '#ffffff',
      logo: '../../../assets/aloftC-01.png',
      quietZone: 3,
      quietZoneColor: 'rgb(52, 58, 64,0.5)',
    };

    // Create new QRCode Object
    new QRCode(this.qrcode.nativeElement, options);
  }

  openBigQrDialog(voucher: Voucher): void {
    this.dialog.open(QrCodeInfoComponent, {
      width: '600px',
      data: { voucher },
    });
  }
  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
  }
}
