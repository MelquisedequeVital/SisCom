
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { MeetingService } from '../../services/meeting.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  
  protected chatService = inject(ChatService);
  protected meetingService = inject(MeetingService);
  protected departmentService = inject(DepartmentService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);

  public totalTickets = computed(() => this.chatService.chats().length);

  public totalMeetingsScheduled = computed(() => this.meetingService.meetings().length);

  public totalActiveDepartments = computed(() => this.departmentService.departments().length);

  public pendingUnreadMessages = computed(() => {
    return this.chatService.chats().reduce((acc, chat) => {
      const unreadCount = chat.messages.filter(msg => !msg.isRead).length || 0;
      return acc + unreadCount;
    }, 0);
  });

  ngOnInit() : void {
  }

  public refreshAllIndicators() : void{
    this.chatService.loadChats();
    this.meetingService.loadMeetings();
    this.departmentService.loadDepartments();
  }

  public navigateTo(route: string) : void {
    this.router.navigate([`/${route}`]);
  }

}
