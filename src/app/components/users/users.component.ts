import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Guest } from 'src/app/shared/models';
import { UsersStorageService } from 'src/app/shared/storage service/users-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  guestsToShow!: Guest[];
  guestsData!: MatTableDataSource<Guest>;
  guestsToShow$$!: Subscription;

  editing!: Guest;

  displayedColumns: string[] = [
    'select',
    'name',
    'type',
    'roomNumber',
    'vouchers',
    'valid untill',
    'actions',
  ];

  constructor(
    private guestsService: UsersStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // showing guest list
    this.guestsToShow$$ = this.guestsService.Guests.subscribe(
      (guests: Guest[]) => {
        this.guestsToShow = guests;
        this.guestsData = new MatTableDataSource<Guest>(this.guestsToShow);
        console.log('nexted', this.guestsToShow);
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

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.guestsData.sort = this.sort;
    this.guestsData.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.guestsToShow$$.unsubscribe();
  }
}
