import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Meeting } from '../models/meeting.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4200/api/meetings';

  private meetingsSignal = signal<Meeting[]>([]);
  public meetings = this.meetingsSignal.asReadonly();

  constructor() {
    this.loadMeetings();
  }

  async loadMeetings() {
    try {
      const data = await firstValueFrom(this.http.get<Meeting[]>(this.apiUrl));
      this.meetingsSignal.set(data);
    } catch (error) {
      console.error('Erro ao carregar reuniões:', error);
    }
  }

  async scheduleMeeting(meeting: Meeting) {
    try {
      const newMeeting = await firstValueFrom(this.http.post<Meeting>(this.apiUrl, meeting));
      this.meetingsSignal.update(meetings => [...meetings, newMeeting]);
      return newMeeting
    } catch (error) {
      console.error("Erro ao marcar reunião: ", error)
      throw error
    }
  }

  async updateMeeting(id: string, meetingData: Partial<Meeting>) {
    try {
      const updatedMeeting = await firstValueFrom(this.http.put<Meeting>(`${this.apiUrl}/${id}`, meetingData));
      this.meetingsSignal.update(meeting =>
        meeting.map(m => m.id === id ? updatedMeeting : m)
      )
    } catch (error) {
      console.error('Erro ao atualizar reunião no SisCom:', error);
      throw error
    }
  }

  async cancelMeeting(id: string) {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
      this.meetingsSignal.update(meeting =>
        meeting.filter(m => m.id !== id)
      );
    } catch (error) {
      console.error("Erro ao cancelar reunião: ", error);
      throw error
    }
  }

  async getMeetingById(id: string): Promise<Meeting | undefined> {
    const cachedMeeting = this.meetingsSignal().find(m => m.id === id);
    if (cachedMeeting) return cachedMeeting;

    try {
      return await firstValueFrom(this.http.get<Meeting>(`${this.apiUrl}/${id}`));
    } catch (error) {
      return undefined;
    }

  }

}
