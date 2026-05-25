import { Component, inject, input, output, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MeetingService } from '../../../services/meeting.service';
import { DepartmentService } from '../../../services/department.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-meeting-modal',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './meeting-modal.html',
})
export class MeetingModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected meetingService = inject(MeetingService);
  protected departmentService = inject(DepartmentService);
  protected userService = inject(UserService);

  initialDate = input<string>(''); 
  closeModal = output<void>();

  meetingData = input<any | null >(null);

  meetingForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    departmentId: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    isRemote: [false]
  });

  ngOnInit(): void {
    this.userService.loadUsers(); 
    
    let dataForm = '';
    
    if (this.initialDate() && this.initialDate().trim() !== '') {
      dataForm = this.initialDate();
    } else {
      const today = new Date();
      const ano = today.getFullYear();
      const mes = String(today.getMonth() + 1).padStart(2, '0');
      const dia = String(today.getDate()).padStart(2, '0');
      dataForm = `${ano}-${mes}-${dia}`;
    }
    
    this.meetingForm.patchValue({
      startTime: `${dataForm}T14:00`,
      endTime: `${dataForm}T15:00`,
      isRemote: false
    });
  } 

  handleSchedule(): void {
    if (this.meetingForm.invalid) return;

  // 1. Busca o primeiro gerente real disponível vindo lá dos seus INITIAL_USERS do mock
    const managerFromMock = this.userService.users().find(u => u.isManager === true);

  // 2. Se por acaso o mock sumir da memória, usamos um fallback micro e simplificado de segurança
    const defaultOrganizer: User = managerFromMock || {
      id: 'SIS-002',
      name: 'Ludmilla Maroja',
      email: 'ludmilla.maroja@siscom.gov.br',
      password: '123',
      isAdmin: true,
      active: true,
      isManager: true,
      createdAt: new Date(),
      chats: [],
      department: { id: 'd2', name: 'Recursos Humanos', code: 'SERH' }
    };

  // 3. Monta o payload limpo e perfeitamente tipado
    const newMeeting = {
      title: this.meetingForm.value.title!,
      departmentId: this.meetingForm.value.departmentId!,
      startTime: new Date(this.meetingForm.value.startTime!),
      endTime: new Date(this.meetingForm.value.endTime!),
      isRemote: this.meetingForm.value.isRemote ?? false,
      
      organizer: defaultOrganizer, 
      participants: [] as User[], 
      meetingLink: this.meetingForm.value.isRemote ?? false
    };

    // salva no Service
    this.meetingService.scheduleMeeting(newMeeting).subscribe({
      next: () => {
        this.closeModal.emit();
      },
      error: () => {
        this.meetingService.loadMeetings(); 
        this.closeModal.emit();
      }
    });
  }
  handleDelete(): void {
    const meeting = this.meetingData();

    if (!meeting || !meeting.id) return;

    if (confirm('Tem certeza que deseja cancelar esta reunião?')) {
      this.meetingService.cancelMeeting(meeting.id).subscribe({
        next: () => {
          this.closeModal.emit();
        },
        error: () => {
          this.meetingService.loadMeetings(); 
          this.closeModal.emit();
        }
      });
    }
  }
}