import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptCard } from './dept-card';

describe('DeptCard', () => {
  let component: DeptCard;
  let fixture: ComponentFixture<DeptCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DeptCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
