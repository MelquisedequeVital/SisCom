import { inject, Injectable, signal } from '@angular/core';
import { Meeting } from '../models/meeting.model';
import { catchError, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private api = inject(ApiService);
  private readonly apiUrl = environment.apiUrl + '/meetings';

  private meetingsSignal = signal<Meeting[]>([]);
  public meetings = this.meetingsSignal.asReadonly();

  constructor() {
  }

  loadMeetings() {
    this.api.getAll<Meeting>(this.apiUrl).subscribe({
      next: (data) => this.meetingsSignal.set(data),
      error: (error) => console.error('Erro ao carregar reuniões:', error)
    });
  }

  scheduleMeeting(meeting: Omit<Meeting, 'id'>) {
    return this.api.create<Meeting>(this.apiUrl, meeting).pipe(
      tap((newMeeting) => {
        this.meetingsSignal.update(meetings => [...meetings, newMeeting]);
      })
    );
  }

  updateMeeting(id: string, meetingData: Partial<Meeting>) {
    const current = this.meetingsSignal().find(m => m.id === id);
    
    if (!current) {
      return throwError(() => new Error("Reunião não encontrada no cache local para atualização"));
    }
    
    const fullUpdatedData = { ...current, ...meetingData };
    
    return this.api.update<Meeting>(this.apiUrl, id, fullUpdatedData).pipe(
      tap((updatedMeeting) => {
        this.meetingsSignal.update(meetings =>
          meetings.map(m => m.id === id ? updatedMeeting : m)
        );
      })
    );
  }

  cancelMeeting(id: string) {
    return this.api.delete<Meeting>(this.apiUrl, id).pipe(
      tap(() => {
        this.meetingsSignal.update(meetings =>
          meetings.filter(m => m.id !== id)
        );
      })
    );
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