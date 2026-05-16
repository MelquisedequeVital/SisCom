import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptManagementComponent } from './dept-management.component';

describe('DeptManagementComponent', () => {
  let component: DeptManagementComponent;
  let fixture: ComponentFixture<DeptManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeptManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
