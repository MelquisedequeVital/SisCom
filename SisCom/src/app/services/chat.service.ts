import { inject, Injectable, signal } from '@angular/core';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    this.api.create<Chat>(this.apiUrl, chat).subscribe({
      next: (newChat) => this.chatsSignal.update(oldChats => [...oldChats, newChat]),
      error: (err) => console.error('Erro ao criar chat:', err)
    });
  }

  removeChat(chatId: string) {
    this.api.delete<Chat>(this.apiUrl, chatId).subscribe({
      next: () => this.chatsSignal.update(chats => chats.filter(c => c.id !== chatId)),
      error: (err) => console.error('Erro ao remover chat no SisCom:', err)
    });
  }

  addMessage(id: string, text: string, senderId: string) {
    const message: Omit<Message, 'id'> = {
      content: text,
      senderID: senderId,
      timestamp: new Date(),
      isRead: false
    };

    const currentChat = this.chatsSignal().find(c => c.id === id);
    if (!currentChat) {
      console.error('Chat não encontrado no cache local para adicionar mensagem');
      return;
    }

    const chatWithNewMessage = {
      ...currentChat,
      messages: [...currentChat.messages, message]
    };

   
    this.api.update<Chat>(this.apiUrl, id, chatWithNewMessage).subscribe({
      next: (updatedChat) => {
        this.chatsSignal.update(chats =>
          chats.map(c => c.id === id ? updatedChat : c)
        );
      },
      error: (err) => console.error('Erro ao adicionar mensagem no chat:', err)
    });
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