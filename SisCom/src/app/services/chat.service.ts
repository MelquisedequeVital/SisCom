import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
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

  async addChat(chat: Omit<Chat, 'id'>) {
    try {
      const newChat = await firstValueFrom(this.http.post<Chat>(this.apiUrl, chat));
      this.chatsSignal.update(oldChats => [...oldChats, newChat]);
      return newChat;
    } catch (error) {
      throw error
    }
  }

  async removeChat(chatId: string) {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${chatId}`));
      this.chatsSignal.update(chats => chats.filter(c => c.id !== chatId));
    } catch (error) {
      console.error('Erro ao remover chat no SisCom:', error);
      throw error
    }

  }

  async addMessage(id: string, text: string, senderId: string) {

    const message: Omit<Message, 'id'> = {
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
      throw error
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

  async markAllAsRead(chatId: string) {
    try {

      const chat = this.chatsSignal().find(c => c.id === chatId);
      if (!chat) return;

      const updatedChatData = {
        ...chat,
        messages: chat.messages.map(msg => ({ ...msg, isRead: true }))
      };

      const serverResponse = await firstValueFrom(
        this.http.put<Chat>(`${this.apiUrl}/${chatId}`, updatedChatData)
      );

      this.chatsSignal.update(chats =>
        chats.map(c => c.id === chatId ? serverResponse : c)
      );

    } catch (error) {
      console.error('Falha ao marcar mensagem como lida no SisCom:', error);
    }
  }

}
