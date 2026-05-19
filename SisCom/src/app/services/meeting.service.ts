import { inject, Injectable, signal } from '@angular/core';
import { Meeting } from '../models/meeting.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private api = inject(ApiService);
  private readonly apiUrl = 'http://localhost:4200/api/meetings';

  private meetingsSignal = signal<Meeting[]>([]);
  public meetings = this.meetingsSignal.asReadonly();

  constructor() {
    this.loadMeetings();
  }

  loadMeetings() {
    this.api.getAll<Meeting>(this.apiUrl).subscribe({
      next: (data) => this.meetingsSignal.set(data),
      error: (error) => console.error('Erro ao carregar reuniões:', error)
    });
  }

  scheduleMeeting(meeting: Omit<Meeting, 'id'>) {
    this.api.create<Meeting>(this.apiUrl, meeting).subscribe({
      next: (newMeeting) => {
        this.meetingsSignal.update(meetings => [...meetings, newMeeting]);
      },
      error: (error) => console.error("Erro ao marcar reunião: ", error)
    });
  }

  updateMeeting(id: string, meetingData: Partial<Meeting>) {
    const current = this.meetingsSignal().find(m => m.id === id);
    
    if (!current) {
      console.error("Reunião não encontrada no cache local para atualização");
      return;
    }
    
    const fullUpdatedData = { ...current, ...meetingData };
    
    this.api.update<Meeting>(this.apiUrl, id, fullUpdatedData).subscribe({
      next: (updatedMeeting) => {
        this.meetingsSignal.update(meetings =>
          meetings.map(m => m.id === id ? updatedMeeting : m)
        );
      },
      error: (error) => console.error('Erro ao atualizar reunião no SisCom:', error)
    });
  }

  cancelMeeting(id: string) {
    this.api.delete<Meeting>(this.apiUrl, id).subscribe({
      next: () => {
        this.meetingsSignal.update(meetings =>
          meetings.filter(m => m.id !== id)
        );
      },
      error: (error) => console.error("Erro ao cancelar reunião: ", error)
    });
  }

  getMeetingById(id: string): Observable<Meeting | undefined> {
    const cachedMeeting = this.meetingsSignal().find(m => m.id === id);
    
    if (cachedMeeting) {
      return of(cachedMeeting);
    }
    
    return this.api.getById<Meeting>(this.apiUrl, id).pipe(
      catchError((error) => {
        console.error(`Erro ao buscar reunião com ID ${id}:`, error);
        return of(undefined);
      })
    );
  }
}