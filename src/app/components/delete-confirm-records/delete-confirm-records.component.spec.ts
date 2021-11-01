import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmRecordsComponent } from './delete-confirm-records.component';

describe('DeleteConfirmRecordsComponent', () => {
  let component: DeleteConfirmRecordsComponent;
  let fixture: ComponentFixture<DeleteConfirmRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConfirmRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
