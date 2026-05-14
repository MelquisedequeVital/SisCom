import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Chat } from '../models/chat.model';
import { firstValueFrom } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4200/api/chats';

  private chatsSignal = signal<Chat[]>([]);
  public chats = this.chatsSignal.asReadonly();

  constructor() {
    this.loadChats();
  }

  async loadChats() {
    try {
      const data = await firstValueFrom(this.http.get<Chat[]>(this.apiUrl));
      this.chatsSignal.set(data);
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    }
  }

  async addChat(chat: Chat) {
    try {
      const newChat = await firstValueFrom(this.http.post<Chat>(this.apiUrl, chat));
      this.chatsSignal.update(oldChats => [...oldChats, newChat]);
      return newChat;
    } catch (error) {
      throw error
    }
  }

  async addMessage(id: string, text: string, senderId: string) {
    
    const message: Message = {
      id: crypto.randomUUID(), // Gera o ID aqui
      content: text,
      senderID: senderId,
      timestamp: new Date(),
      isRead: false
    };

    try {
      const currentChat = this.chatsSignal().find(c => c.id === id);
      if (!currentChat) return;

      const chatWithNewMessage = {
        ...currentChat,
        messages: [...currentChat.messages, message]
      };

      const updatedChat = await firstValueFrom(
        this.http.put<Chat>(`${this.apiUrl}/${id}`, chatWithNewMessage)
      );

      this.chatsSignal.update(chats =>
        chats.map(c => c.id === id ? updatedChat : c)
      );

    } catch (error) {
      console.error('Erro ao adicionar mensagem no chat:', error);
    }
  }

  async getChatById(id: string): Promise<Chat | undefined> {
    const cached = this.chatsSignal().find(c => c.id === id);
    if (cached) return cached;

    try {
      return await firstValueFrom(this.http.get<Chat>(`${this.apiUrl}/${id}`));
    } catch (error) {
      return undefined;
    }
  }

}
