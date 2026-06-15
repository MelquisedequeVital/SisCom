import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatManagementSelection } from './chat-management-selection';

describe('ChatManagementSelection', () => {
  let component: ChatManagementSelection;
  let fixture: ComponentFixture<ChatManagementSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatManagementSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatManagementSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
