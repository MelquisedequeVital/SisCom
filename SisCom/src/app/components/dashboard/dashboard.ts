import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { MeetingService } from '../../services/meeting.service';
import { DepartmentService } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';

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
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);

  public currentUser = this.authService.currentUser;

  public totalChats = computed(() => {
    const userId = this.currentUser()?.id;
    if (!userId) return 0;

    return this.chatService.chats().filter(chat => 
      chat.requesterId === userId || 
      (chat.participants || []).some(p => p?.id === userId)
    ).length;
  });

  public totalMeetingsScheduled = computed(() => {
    const userId = this.currentUser()?.id;
    if (!userId) return 0;

    return this.meetingService.meetings().filter(meeting => 
      (meeting as any).organizerId === userId || 
      ((meeting as any).participants || []).some((p: any) => p?.id === userId || p === userId)
    ).length;
  });

  public totalActiveDepartments = computed(() => {
    const userId = this.currentUser()?.id;
    if (!userId) return 0;
    
    const userChats = this.chatService.chats().filter(chat => 
      chat.requesterId === userId || 
      (chat.participants || []).some(p => p?.id === userId)
    );

    const deptsIdSet = new Set<string>();
    
    userChats.forEach(chat => {
      if (chat.requestedDepartmentId) {
        deptsIdSet.add(chat.requestedDepartmentId);
      }
    });

    const userDeptId = this.currentUser()?.department?.id;
    if (userDeptId) {
      deptsIdSet.add(userDeptId);
    }

    return deptsIdSet.size;
  });

  ngOnInit() : void {
    this.chatService.loadChats();
    this.meetingService.loadMeetings();
    this.departmentService.loadDepartments();
  }

  public navigateTo(route: string) : void {
    this.router.navigate([`/${route}`]);
  }
}
