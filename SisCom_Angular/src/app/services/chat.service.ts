import { inject, Injectable, signal } from '@angular/core';
import { Chat } from '../models/chat.model';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { Client } from '@stomp/stompjs'; // <-- Importação do STOMP

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private api = inject(ApiService);
  private userServ = inject(UserService);
  private readonly apiUrl = 'http://localhost:8080/api/siscom/chat';

  private chatsSignal = signal<Chat[]>([]);
  public chats = this.chatsSignal.asReadonly();

  constructor() {}

  loadChats(userId?: string) {
    const url = userId ? `${this.apiUrl}?userId=${userId}` : this.apiUrl;
    this.api.getAll<Chat>(url).subscribe({
      next: (data) => this.chatsSignal.set(data),
      error: (err) => console.error('Erro ao carregar chats:', err)
    });
  }

  addChat(chat: any): Observable<Chat> {
    return this.api.create<Chat>(this.apiUrl, chat).pipe(
      tap(newChat => {
        if (newChat) {
          newChat.messages = newChat.messages || [];
          newChat.participantIds = newChat.participantIds || [];
          newChat.participants = newChat.participants || [];
        }

        this.chatsSignal.update(oldChats => [newChat, ...oldChats]);
      })
    );
  }

  removeChat(chatId: string) {
    const chatToRemove = this.chatsSignal().find(c => c.id === chatId);

    return this.api.delete<Chat>(this.apiUrl, chatId).pipe(
      tap(() => {
        this.chatsSignal.update(chats => chats.filter(c => c.id !== chatId));

        if (chatToRemove) {
          chatToRemove.participants.forEach(user => {
            const updatedChats = user.chats.filter(id => id !== chatId);
            this.userServ.updateUser(user.id, { chats: updatedChats }).subscribe({
              error: (err) => console.error(`Erro ao desvincular chat do usuário ${user.id}:`, err)
            });
          });
        }
      })
    );
  }


  getChatById(id: string): Observable<Chat | undefined> {
    return this.api.getById<Chat>(this.apiUrl, id).pipe(
      catchError((error) => {
        console.error(`Erro ao buscar chat com ID ${id}:`, error);
        return of(undefined);
      })
    );
  }


  addMessage(stompClient: Client | null, id: string, text: string, senderId: string): void {
    if (!stompClient || !stompClient.connected) {
      console.error('Não foi possível enviar: O cliente WebSocket STOMP está desconectado.');
      return;
    }


    const messagePayload = { 
      content: text,
      senderId: senderId,
      chatId: id
    };


    stompClient.publish({
      destination: `/ws/chat/messages/${id}`, 
      body: JSON.stringify(messagePayload)
    });
  }

  appendMessageLocally(chatId: string, message: any) {
    this.chatsSignal.update(chats =>
      chats.map(c => {
        if (c.id === chatId) {
          return { ...c, messages: [...(c.messages || []), message] };
        }
        return c;
      })
    );
  }
}