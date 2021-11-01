import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Guest, Record } from 'src/app/shared/models';
import { RecordsService } from 'src/app/shared/records service/records.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
  records!: Record[];

  @Input() guest!: Guest;

  recordsLength = 0;

  constructor(private recordsService: RecordsService) {}

  ngOnInit(): void {
    this.recordsService.recordsArray.subscribe((recordsData) => {
      this.records = recordsData;
      this.recordsLength = recordsData.length;
    });
  }
}
