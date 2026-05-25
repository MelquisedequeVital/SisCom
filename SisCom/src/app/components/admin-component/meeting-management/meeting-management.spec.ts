import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingManagement } from './meeting-management';

describe('MeetingManagement', () => {
  let component: MeetingManagement;
  let fixture: ComponentFixture<MeetingManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
