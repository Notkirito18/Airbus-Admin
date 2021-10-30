import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vender-home',
  templateUrl: './vender-home.component.html',
  styleUrls: ['./vender-home.component.scss'],
})
export class VenderHomeComponent implements OnInit {
  constructor(private router: Router) {}
  voucherIdToUse!: string;

  ngOnInit(): void {}

  useVoucherClick() {
    this.router.navigate(['/using/' + this.voucherIdToUse]);
  }
}
