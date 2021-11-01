import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-confirm-records',
  templateUrl: './delete-confirm-records.component.html',
  styleUrls: ['./delete-confirm-records.component.scss'],
})
export class DeleteConfirmRecordsComponent {
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthServiceService,
    public dialogRef: MatDialogRef<DeleteConfirmRecordsComponent>
  ) {}

  tokenSub!: Subscription;

  onNoClick(): void {
    this.dialogRef.close();
  }
  celarRecords() {
    this.tokenSub = this.authService.user.pipe(take(1)).subscribe((user) => {
      const token = user.token;
      this.http
        .put(
          'https://airbus-900f9-default-rtdb.firebaseio.com/records.json?auth=' +
            token,
          {}
        )
        .subscribe((result) => {
          console.log('clear All ');
        });
    });
  }
}
