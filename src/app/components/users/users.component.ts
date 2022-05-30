import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Guest, Voucher } from 'src/app/shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  checkDate,
  displayFlexOrBlock,
  filterValidVouchers,
  hideElementResponsivly,
  responsiveContainerPaddingPx,
  responsiveWidth,
} from '../../shared/helper';
import { GuestGeneratedComponent } from '../guest-generated/guest-generated.component';
import { GuestsService } from 'src/app/shared/guests-service/guests.service';
import { AuthServiceService } from 'src/app/shared/auth/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  @Input() adminUser!: boolean;

  guestsToShow: Guest[] = [];
  guestsData = new MatTableDataSource<Guest>(this.guestsToShow);
  voucherId!: string;
  myFilterString = '';

  editing!: Guest;

  displayedColumns: string[] = [
    'name',
    'type',
    'roomNumber',
    'vouchers',
    'validUntill',
    'actions',
  ];

  constructor(
    private guestsService: GuestsService,
    private authService: AuthServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private mediaObserver: MediaObserver
  ) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  mediaSubscription!: Subscription;
  screenSize = 'lg';

  ngOnInit(): void {
    // screen Size
    this.mediaSubscription = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.screenSize = result.mqAlias;
      }
    );
    //getting token
    const { _token, userDataId } = this.authService.getStorageData();
    if (_token && userDataId) {
      // showing guest list
      this.guestsService.getAllGuests(_token, userDataId).subscribe(
        (guests: Guest[]) => {
          this.guestsToShow = guests;
          this.guestsData = new MatTableDataSource<Guest>(guests);
          this.guestsData.sortingDataAccessor = (item: any, property: any) => {
            if (property === 'vouchers') {
              return item.vouchersLis.length;
            } else {
              return item[property];
            }
          };
          if (guests.length > 0) {
            this.guestsData.sort = this.sort;
            this.guestsData.paginator = this.paginator;
          }
        },
        (error) => {
          this.authService.notification.next({
            msg: error.error.msg,
            type: 'error',
          });
        }
      );
    } else {
      this.router.navigate(['/auth']);
    }
  }

  openDeleteGuestDialog(id: string, name: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '250px',
      data: { name, id },
    });
    dialogRef.afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.guestsData.data = this.guestsData.data.filter(
          (item) => item._id != id
        );
        this.authService.notification.next({
          msg: 'Guest Deleted',
          type: 'notError',
        });
      } else {
        this.authService.notification.next({
          msg: 'Something went wrong when deleting guest',
          type: 'notError',
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.guestsData.filter = filterValue.trim().toLowerCase();

    if (this.guestsData.paginator) {
      this.guestsData.paginator.firstPage();
    }
  }

  openGuestDialog(guest: Guest): void {
    this.dialog.open(GuestGeneratedComponent, {
      width: '350px',
      data: { guest },
    });
  }

  ngOnDestroy() {
    this.mediaSubscription.unsubscribe();
  }

  filterValidVouchers = filterValidVouchers;
  checkDate = checkDate;
  responsiveContainerPaddingPx = responsiveContainerPaddingPx;
  hideElementResponsivly = hideElementResponsivly;
  responsiveWidth = responsiveWidth;
  displayFlexOrBlock = displayFlexOrBlock;
}
