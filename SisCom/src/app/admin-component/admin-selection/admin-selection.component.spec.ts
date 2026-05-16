import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSelectionComponent } from './admin-selection.component';

describe('AdminSelectionComponent', () => {
  let component: AdminSelectionComponent;
  let fixture: ComponentFixture<AdminSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSelectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
