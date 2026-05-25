import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptModal } from './dept-modal';

describe('DeptModal', () => {
  let component: DeptModal;
  let fixture: ComponentFixture<DeptModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DeptModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
