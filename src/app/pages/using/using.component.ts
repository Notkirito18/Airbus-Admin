import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { Guest, RecordAddObject, Voucher } from 'src/app/shared/models';
import { GuestsService } from 'src/app/shared/guests-service/guests.service';
import { RecordsService } from 'src/app/shared/records service/records.service';

@Component({
  selector: 'app-using',
  templateUrl: './using.component.html',
  styleUrls: ['./using.component.scss'],
})
export class UsingComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private guestsService: GuestsService,
    private recordsService: RecordsService,
    private authService: AuthServiceService
  ) {}

  voucherUsed!: Voucher;
  loading = true;
  usedVoucherid!: string;
  guest: Guest = new Guest('', '', 0, '', new Date(), []);
  voucherExpired!: 'no' | 'expired' | 'notAuth';
  voucherDateExpired = true;
  token!: string;
  admin = false;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // getting voucher id
      this.usedVoucherid = params['id'];
      //*deleting/unvalidating used voucher
      const { _token, userDataId, admin } = this.authService.getStorageData();
      this.admin = admin;
      if (!_token) {
        this.voucherExpired = 'notAuth';
        this.loading = false;
      } else {
        // checking validity
        this.guestsService.getAllGuests(_token, userDataId).subscribe(
          (guests: Guest[]) => {
            guests.forEach((element) => {
              element.vouchersLis.forEach((voucher) => {
                if (voucher._id == this.usedVoucherid) {
                  this.voucherUsed = voucher;
                  this.guest = element;
                }
              });
            });
            // voucher couldn't be found
            if (!this.voucherUsed) {
              this.voucherExpired = 'expired';
              this.loading = false;
            } else {
              //voucher found and is unvalid
              const newDate = new Date();
              const expirationDate = new Date(this.voucherUsed.validUntill);
              this.voucherDateExpired =
                newDate.getTime() > expirationDate.getTime();
              if (this.voucherUsed.unvalid || this.voucherDateExpired) {
                this.voucherExpired = 'expired';
                this.loading = false;
              } else {
                //voucher found and valid
                this.voucherExpired = 'no';
                const updatedVouchersList = this.guest.vouchersLis.map(
                  (item) => {
                    if (item._id == this.usedVoucherid) {
                      return { ...item, unvalid: true };
                    }
                    return item;
                  }
                );
                this.guestsService
                  .updateGuest(
                    this.voucherUsed.holderId,
                    { ...this.guest, vouchersLis: updatedVouchersList },
                    _token,
                    userDataId
                  )
                  .subscribe(
                    (guest: Guest) => {
                      const recordToAdd: RecordAddObject = {
                        date: new Date(),
                        type: 'voucher_use',
                        guestId: guest._id,
                        guestName: guest.name,
                        userDataId: userDataId,
                        voucherId: this.voucherUsed._id,
                      };
                      //* saving record of usage
                      this.recordsService
                        .addRecord(recordToAdd, _token, userDataId)
                        .subscribe(
                          (record) => {
                            this.authService.notification.next({
                              msg: 'Record saved',
                              type: 'notError',
                            });
                          },
                          (error) => {
                            this.authService.notification.next({
                              msg: error.error.msg,
                              type: 'error',
                            });
                          }
                        );
                      this.loading = false;
                    },
                    (error) => {
                      this.authService.notification.next({
                        msg: error.error.msg,
                        type: 'error',
                      });
                    }
                  );
              }
            }
          },
          (error) => {
            this.authService.notification.next({
              msg: error.error.msg,
              type: 'error',
            });
          }
        );
      }
    });
  }
}
