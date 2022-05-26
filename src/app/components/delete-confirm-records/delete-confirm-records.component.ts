import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-records',
  templateUrl: './delete-confirm-records.component.html',
  styleUrls: ['./delete-confirm-records.component.scss'],
})
export class DeleteConfirmRecordsComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmRecordsComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  celarRecords() {
    this.dialogRef.close(true);
  }
}
