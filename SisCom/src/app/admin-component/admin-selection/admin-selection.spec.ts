import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSelection } from './admin-selection';

describe('AdminSelection', () => {
  let component: AdminSelection;
  let fixture: ComponentFixture<AdminSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
