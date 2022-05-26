import { Component, Input, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { GuestsService } from 'src/app/shared/guests-service/guests.service';
import { Guest, Record } from 'src/app/shared/models';
import { RecordsService } from 'src/app/shared/records service/records.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
  @Input() guest!: Guest;
  @Input() records!: any[];

  recordsLength = 0;

  constructor() {}

  ngOnInit(): void {
    this.recordsLength = this.records.length;
  }
}
