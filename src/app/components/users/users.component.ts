import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Guest } from 'src/app/shared/models';
import { UsersStorageService } from 'src/app/shared/storage service/users-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  displayFlexOrBlock,
  hideElementResponsivly,
  responsiveContainerPaddingPx,
  responsiveWidth,
} from '../../shared/helper';
import { GuestGeneratedComponent } from '../guest-generated/guest-generated.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  @Input() adminUser!: boolean;

  guestsToShow: Guest[] = [];
  guestsData = new MatTableDataSource<Guest>(this.guestsToShow);
  guestsToShow$$!: Subscription;
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
    private guestsService: UsersStorageService,
    private dialog: MatDialog,
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
    //sort fixing

    // showing guest list
    this.guestsToShow$$ = this.guestsService.Guests.subscribe(
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
        this.guestsData.sort = this.sort;
        this.guestsData.paginator = this.paginator;
      }
    );
    this.guestsService.populateGuests();
  }

  openDeleteGuestDialog(id: string, name: string): void {
    this.dialog.open(DeleteConfirmComponent, {
      width: '250px',
      data: { name, id },
    });
  }

  removeGuest(id: string) {
    // this.guestsService.removeGuest(id);
    console.log('removed ', id);
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
    this.guestsToShow$$.unsubscribe();
    this.mediaSubscription.unsubscribe();
  }

  responsiveContainerPaddingPx = responsiveContainerPaddingPx;
  hideElementResponsivly = hideElementResponsivly;
  responsiveWidth = responsiveWidth;
  displayFlexOrBlock = displayFlexOrBlock;
}
