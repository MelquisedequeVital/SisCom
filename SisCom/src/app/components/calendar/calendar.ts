import { Component, OnInit, signal, inject, computed, importProvidersFrom } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { DepartmentService } from '../../services/department.service';
import { UserService } from '../../services/user.service';
import { MeetingModalComponent } from './meeting-modal/meeting-modal';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [MeetingModalComponent],
  templateUrl: './calendar.html',
})
export class Calendar implements OnInit {

  protected meetingService = inject(MeetingService);
  protected departmentService = inject(DepartmentService);
  protected userService = inject(UserService);

  public currentDate = signal<Date>(new Date());
  public isModalOpen = signal<boolean>(false);
  public isManager = signal<boolean>(true);
  public selectedDateForMeeting = signal<Date | null>(null);
  private users = this.userService.users;

  managers = computed(() => this.users().filter(u => u.isManager));

  public months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  public calendarDays = computed(() => {
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const days: {dayNumber: number | null; fullDate: string } [] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ dayNumber: null, fullDate: '' });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dayNumber: i, fullDate: currentDate });
    }

    return days;
  });

  public getMeetingsForDate(dateStr: string) {
    if (!dateStr) return [];
    return this.meetingService.meetings().filter(m => {
      const meetingDate = new Date(m.startTime);
      const formattedMeetingDate = `${meetingDate.getFullYear()}-${String(meetingDate.getMonth() + 1).padStart(2, '0')}-${String(meetingDate.getDate()).padStart(2, '0')}`;
      return formattedMeetingDate === dateStr;
    });
  }

  ngOnInit(): void {
    this.meetingService.loadMeetings();
    this.departmentService.loadDepartments();
  }

  public nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  public previousMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  // Criamos uma variável para guardar a reunião que o usuário clicou para assistir
 // 1. Adicione essas três propriedades logo no início da sua classe Calendar:
  public selectedMeeting = signal<any | null>(null);

// 2. Atualize a função para receber a reunião quando clicada:
  public openMeetingModel(dateStr: string = '', meeting: any = null): void {
  // Se clicou em um bloco de reunião que já existe: abre para qualquer um ver!
    if (meeting) {
      this.selectedMeeting.set(meeting);
      this.isModalOpen.set(true);
      return;
    }

  // Se clicou no quadrado vazio para criar: só deixa passar se for gerente!
    if (!this.isManager()) return;

    this.selectedMeeting.set(null); // Limpa para vir o formulário em branco
    this.selectedDateForMeeting.set(dateStr ? new Date(dateStr) : null);
    this.isModalOpen.set(true);
  }

}
