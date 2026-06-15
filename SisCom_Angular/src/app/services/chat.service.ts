import { inject, Injectable, signal } from '@angular/core';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UserService } from './user.service'; // <-- Adicione esta importação

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private api = inject(ApiService);
  private userServ = inject(UserService); // <-- Injetando o UserService
  private readonly apiUrl = 'http://localhost:4200/api/chats';

  private chatsSignal = signal<Chat[]>([]);
  public chats = this.chatsSignal.asReadonly();

  constructor() {
    this.loadChats();
    window.addEventListener('storage', (event) => {
      console.log('Outra aba modificou o banco! Recarregando chats...');
      this.loadChats();
    });
  }

  loadChats() {
    this.api.getAll<Chat>(this.apiUrl).subscribe({
      next: (data) => this.chatsSignal.set(data),
      error: (err) => console.error('Erro ao carregar chats:', err)
    });

    
  }

  addChat(chat: Omit<Chat, 'id'>) {
    return this.api.create<Chat>(this.apiUrl, chat).pipe(
      tap(newChat => {
        // 1. Atualiza o signal local de chats
        this.chatsSignal.update(oldChats => [...oldChats, newChat]);

        // 2. Atualiza o perfil de cada participante no banco de dados
        newChat.participants.forEach(user => {
          // Garante que não adicionamos o ID duplicado
          if (!user.chats.includes(newChat.id)) {
            const updatedChats = [...user.chats, newChat.id];

            // Dispara a atualização silenciosa no UserService
            this.userServ.updateUser(user.id, { chats: updatedChats }).subscribe({
              error: (err) => console.error(`Erro ao vincular chat ao usuário ${user.id}:`, err)
            });
          }
        });
      })
    );
  }

  removeChat(chatId: string) {
    // 1. Salva a referência do chat ANTES de apagar, para sabermos quem participava dele
    const chatToRemove = this.chatsSignal().find(c => c.id === chatId);

    return this.api.delete<Chat>(this.apiUrl, chatId).pipe(
      tap(() => {
        // 2. Remove do signal local de chats
        this.chatsSignal.update(chats => chats.filter(c => c.id !== chatId));

        // 3. Vai em cada participante e retira este ID da lista deles
        if (chatToRemove) {
          chatToRemove.participants.forEach(user => {
            const updatedChats = user.chats.filter(id => id !== chatId);

            // Dispara a atualização no UserService
            this.userServ.updateUser(user.id, { chats: updatedChats }).subscribe({
              error: (err) => console.error(`Erro ao desvincular chat do usuário ${user.id}:`, err)
            });
          });
        }
      })
    );
  }

  addMessage(id: string, text: string, senderId: string) {
    const currentChat = this.chatsSignal().find(c => c.id === id);

    if (!currentChat) {
      return throwError(() => new Error('Chat não encontrado no cache local'));
    }

    const message: Message = {
      id: crypto.randomUUID(),
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