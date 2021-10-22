import { TestBed } from '@angular/core/testing';

import { UsersStorageService } from './users-storage.service';

describe('UsersStorageService', () => {
  let service: UsersStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
