import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Guest } from 'src/app/shared/models';
import { UsersStorageService } from 'src/app/shared/storage service/users-storage.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {
  newGuestForm!: FormGroup;

  validUntill = new Date(new Date().setDate(new Date().getDate() + 7));
  validUntillAsString =
    this.validUntill.getDate() +
    '/' +
    this.validUntill.getMonth() +
    '/' +
    this.validUntill.getFullYear();

  constructor(
    private fb: FormBuilder,
    private guestsService: UsersStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newGuestForm = this.fb.group({
      name: ['', Validators.required],
      roomNumber: ['', Validators.required],
      vouchers: [21, Validators.required],
      type: ['', Validators.required],
    });
  }

  onSubmitForm(newGuest: any) {
    const generatedId = Date.now().toString();

    this.guestsService.addGuest(
      new Guest(
        generatedId,
        newGuest.name,
        newGuest.roomNumber,
        newGuest.type,
        newGuest.vouchers,
        this.validUntillAsString
      )
    );
    this.router.navigate(['/home/users']);
  }
}
