import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import QRCode from 'easyqrcodejs';
import { Voucher } from 'src/app/shared/models';
@Component({
  selector: 'app-qr-code-card',
  templateUrl: './qr-code-card.component.html',
  styleUrls: ['./qr-code-card.component.scss'],
})
export class QrCodeCardComponent implements OnInit, AfterViewInit {
  @Input() voucher!: Voucher;

  constructor() {}

  ngOnInit(): void {}

  @ViewChild('qrcode', { static: false }) qrcode!: ElementRef;

  ngAfterViewInit() {
    // Options
    var options = {
      text: 'http://localhost:4200/using/' + this.voucher.id,
      width: 100,
      height: 100,
      colorDark: '#440024',
      colorLight: '#ffffff',
      logo: '../../../assets/aloftC-01.png',
    };

    // Create new QRCode Object
    new QRCode(this.qrcode.nativeElement, options);
  }
}
