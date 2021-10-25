import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestGeneratedComponent } from './guest-generated.component';

describe('GuestGeneratedComponent', () => {
  let component: GuestGeneratedComponent;
  let fixture: ComponentFixture<GuestGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestGeneratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
