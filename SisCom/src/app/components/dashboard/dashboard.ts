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

  public isManager = computed(() => {
    const user = this.currentUser();
    return user?.isManager === true || user?.isAdmin === true;
  });

  public isDepartmentsExpanded = signal<boolean>(false);

  public monitoredDepartmentsList = computed(() => {
    const user = this.currentUser();
    if (!user || (!user.isManager && !user.isAdmin)) return [];
    const monitored = [];
    if (user.managedDepartment) {
      monitored.push(user.managedDepartment);
    } 
    else if (user.department) {
      monitored.push(user.department);
    }
    return monitored;
  });

  public totalChats = computed(() => {
    const userId = this.currentUser()?.id;
    if (!userId) return 0;

    return this.chatService.chats().filter(chat => 
      chat.requesterId === userId || 
      (chat.participants || []).some(p => p?.id === userId)
    ).length;
  });

  public totalMeetingsScheduled = computed(() => {
    const user = this.currentUser();
    if (!user) return 0;

    const allMeetings = this.meetingService.meetings();

    // Se for Admin ou Gerente, ele vê todas as reuniões agendadas no sistema/departamento
    if (user.isAdmin || user.isManager) {
      return allMeetings.length;
    }

    // Se for usuário comum, vê apenas as que ele organizou ou participa
    return allMeetings.filter(meeting => 
      meeting.organizer?.id === user.id || 
      (meeting.participants || []).some((p: any) => p?.id === user.id)
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

  // força o carregamento dos dados direto na construção do componente
  constructor() {
    this.chatService.loadChats();
    this.meetingService.loadMeetings();
    this.departmentService.loadDepartments();
  }

  ngOnInit() : void {
    //mantém as chamadas aqui por garantia de ciclo de vida do Angular
    this.chatService.loadChats();
    this.meetingService.loadMeetings();
    this.departmentService.loadDepartments();
  }

  public navigateTo(route: string) : void {
    this.router.navigate([`/${route}`]);
  }

  public toggleDepartments(): void {
    this.isDepartmentsExpanded.update(val => !val);
  }
}