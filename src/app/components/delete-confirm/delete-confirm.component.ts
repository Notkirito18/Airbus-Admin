import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { GuestsService } from 'src/app/shared/guests-service/guests.service';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss'],
})
export class DeleteConfirmComponent {
  constructor(
    private guestsService: GuestsService,
    private router: Router,
    public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    private authService: AuthServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; name: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  removeGuest(_id: string) {
    // getting token
    const { _token, userDataId, admin } = this.authService.getStorageData();
    if (_token && userDataId && admin) {
      console.log(_id);

      this.guestsService.removeGuest(_id, _token, userDataId).subscribe(
        (result) => {
          console.log(result);
          this.dialogRef.close(true);
        },
        (error) => {
          console.log('remove error', error);
          this.dialogRef.close(false);
        }
      );
    }
  }
}
