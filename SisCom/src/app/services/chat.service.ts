import { inject, Injectable, signal } from '@angular/core';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private api = inject(ApiService);
  private readonly apiUrl = 'http://localhost:4200/api/chats';

  private chatsSignal = signal<Chat[]>([]);
  public chats = this.chatsSignal.asReadonly();

  constructor() {
    this.loadChats();
  }

  loadChats() {
    this.api.getAll<Chat>(this.apiUrl).subscribe({
      next: (data) => this.chatsSignal.set(data),
      error: (err) => console.error('Erro ao carregar chats:', err)
    });
  }

  addChat(chat: Omit<Chat, 'id'>) {
    return this.api.create<Chat>(this.apiUrl, chat).pipe(
      tap(newChat => this.chatsSignal.update(oldChats => [...oldChats, newChat]))
    );
  }

  removeChat(chatId: string) {
    return this.api.delete<Chat>(this.apiUrl, chatId).pipe(
      tap(() => this.chatsSignal.update(chats => chats.filter(c => c.id !== chatId)))
    );
  }

  addMessage(id: string, text: string, senderId: string) {
    const currentChat = this.chatsSignal().find(c => c.id === id);

    if (!currentChat) {
      return throwError(() => new Error('Chat não encontrado no cache local'));
    }

    const message: Omit<Message, 'id'> = {
      content: text,
      senderID: senderId,
      timestamp: new Date(),
      isRead: false
    };

    const chatWithNewMessage = {
      ...currentChat,
      messages: [...currentChat.messages, message]
    };

    return this.api.update<Chat>(this.apiUrl, id, chatWithNewMessage).pipe(
      tap((updatedChat) => {
        this.chatsSignal.update(chats =>
          chats.map(c => c.id === id ? updatedChat : c)
        );
      })
    );
  }

  getChatById(id: string): Observable<Chat | undefined> {
    const cached = this.chatsSignal().find(c => c.id === id);


    if (cached) {
      return of(cached);
    }


    return this.api.getById<Chat>(this.apiUrl, id).pipe(
      catchError((error) => {
        console.error(`Erro ao buscar chat com ID ${id}:`, error);
        return of(undefined);
      })
    );
  }

  markAllAsRead(chatId: string) {
    const chat = this.chatsSignal().find(c => c.id === chatId);
    if (!chat) return;

    const updatedChatData = {
      ...chat,
      messages: chat.messages.map(msg => ({ ...msg, isRead: true }))
    };

    // Usando o update (PUT) do ApiService para registrar a leitura
    this.api.update<Chat>(this.apiUrl, chatId, updatedChatData).subscribe({
      next: (serverResponse) => {
        this.chatsSignal.update(chats =>
          chats.map(c => c.id === chatId ? serverResponse : c)
        );
      },
      error: (err) => console.error('Falha ao marcar mensagem como lida no SisCom:', err)
    });
  }
}