import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingSelection } from './meeting-selection';

describe('MeetingSelection', () => {
  let component: MeetingSelection;
  let fixture: ComponentFixture<MeetingSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
