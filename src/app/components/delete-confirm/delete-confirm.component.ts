import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsersStorageService } from 'src/app/shared/storage service/users-storage.service';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss'],
})
export class DeleteConfirmComponent {
  constructor(
    private guestsService: UsersStorageService,
    private router: Router,
    public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; name: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  removeGuest(id: string) {
    this.guestsService.removeGuest(id);
    this.router.navigate(['/home']);
  }
}
