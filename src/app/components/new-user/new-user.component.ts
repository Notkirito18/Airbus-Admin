import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Guest } from 'src/app/shared/models';
import { UsersStorageService } from 'src/app/shared/storage service/users-storage.service';
import { VouchersServiceService } from 'src/app/shared/vouchers service/vouchers-service.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit, OnDestroy {
  newGuestForm!: FormGroup;
  editingMode = false;
  guestToEdit!: Guest;
  paramsSub$$!: Subscription;

  validUntillInit = new Date(new Date().setDate(new Date().getDate() + 7));

  constructor(
    private fb: FormBuilder,
    private guestsService: UsersStorageService,
    private vouchersService: VouchersServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.newGuestForm = this.fb.group({
      name: ['', Validators.required],
      roomNumber: ['', Validators.required],
      vouchers: [21, Validators.required],
      type: ['', Validators.required],
      validUntill: ['', Validators.required],
    });

    this.paramsSub$$ = this.route.params.subscribe((params: Params) => {
      this.http.get(this.guestsService.url).subscribe((data) => {
        let guestsArray = Object.values(data);
        for (let i = 0; i < guestsArray.length; i++) {
          if (guestsArray[i].id === params['id']) {
            this.editingMode = true;
            this.guestToEdit = guestsArray[i];

            // init edit form
            this.newGuestForm = this.fb.group({
              name: [this.guestToEdit.name, Validators.required],
              roomNumber: [this.guestToEdit.roomNumber, Validators.required],
              vouchers: [this.guestToEdit.vouchers, Validators.required],
              type: [this.guestToEdit.type, Validators.required],
              validUntill: [this.guestToEdit.validUntill, Validators.required],
            });

            //logging
            console.log('condition met');
            console.log(
              'edit mode :',
              this.editingMode,
              '| guest to edit :',
              this.guestToEdit
            );
          }
        }
      });
    });
  }

  onSubmitForm(newGuest: Guest) {
    if (this.editingMode) {
      this.guestsService.updateGuest(
        this.guestToEdit.id,
        new Guest(
          this.guestToEdit.id,
          newGuest.name,
          newGuest.roomNumber,
          newGuest.type,
          newGuest.vouchers,
          newGuest.validUntill,
          this.vouchersService.vouchersGenerator(
            newGuest.vouchers,
            this.guestToEdit.id,
            newGuest.validUntill
          ),
          new Date()
        )
      );
    } else {
      const generatedId = Date.now().toString();
      this.guestsService.addGuest(
        new Guest(
          generatedId,
          newGuest.name,
          newGuest.roomNumber,
          newGuest.type,
          newGuest.vouchers,
          newGuest.validUntill,
          this.vouchersService.vouchersGenerator(
            newGuest.vouchers,
            generatedId,
            newGuest.validUntill
          ),
          new Date()
        )
      );
    }
    this.router.navigate(['/home/users']);
  }

  ngOnDestroy(): void {
    this.paramsSub$$.unsubscribe();
  }
}
