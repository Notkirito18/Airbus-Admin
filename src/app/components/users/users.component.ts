import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Guest, Voucher } from 'src/app/shared/models';
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

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  guestsToShow: Guest[] = [];
  guestsData = new MatTableDataSource<Guest>(this.guestsToShow);
  guestsToShow$$!: Subscription;
  voucherId!: string;

  editing!: Guest;

  displayedColumns: string[] = [
    'select',
    'name',
    'type',
    'roomNumber',
    'vouchers',
    'validUntill',
    'createdModified',
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

    // showing guest list
    this.guestsToShow$$ = this.guestsService.Guests.subscribe(
      (guests: Guest[]) => {
        this.guestsToShow = guests;
        this.guestsData = new MatTableDataSource<Guest>(guests);
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

  ngOnDestroy() {
    this.guestsToShow$$.unsubscribe();
    this.mediaSubscription.unsubscribe();
  }

  responsiveContainerPaddingPx = responsiveContainerPaddingPx;
  hideElementResponsivly = hideElementResponsivly;
  responsiveWidth = responsiveWidth;
  displayFlexOrBlock = displayFlexOrBlock;

  nameClick(id: string) {
    this.router.navigate(['guest', id]);
  }
}
