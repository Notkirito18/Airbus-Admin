import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderHomeComponent } from './vender-home.component';

describe('VenderHomeComponent', () => {
  let component: VenderHomeComponent;
  let fixture: ComponentFixture<VenderHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenderHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenderHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
