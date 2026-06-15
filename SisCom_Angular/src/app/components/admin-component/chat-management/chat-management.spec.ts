import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatManagement } from './chat-management';

describe('ChatManagement', () => {
  let component: ChatManagement;
  let fixture: ComponentFixture<ChatManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
