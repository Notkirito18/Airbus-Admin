import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Guest } from 'src/app/shared/models';
import QRCode from 'easyqrcodejs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-guest-generated',
  templateUrl: './guest-generated.component.html',
  styleUrls: ['./guest-generated.component.scss'],
})
export class GuestGeneratedComponent {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<GuestGeneratedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { guest: Guest }
  ) {}

  @ViewChild('qrcode', { static: false }) qrcode!: ElementRef;

  ngAfterViewInit() {
    // Options
    var options = {
      text: environment.serverUrl + 'guest/' + this.data.guest._id,
      width: 150,
      height: 150,
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
}
