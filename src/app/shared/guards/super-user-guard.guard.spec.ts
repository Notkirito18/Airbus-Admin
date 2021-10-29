import { TestBed } from '@angular/core/testing';

import { SuperUserGuardGuard } from './super-user-guard.guard';

describe('SuperUserGuardGuard', () => {
  let guard: SuperUserGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SuperUserGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
