import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../models/chat.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-chat-component.html',
})
export class ActiveChatComponent {
  private chatServ = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public chatId = input<string | null>(null);
  public isSidebarOpen = input<boolean>(true); 
  public onToggleSidebar = output<void>();

  public loggedInUserId = computed(() => this.authService.currentUser()?.id || '');;

  private allChats = this.chatServ.chats;

  public chat = computed(() => {
    const id = this.chatId();
    if (!id) return null;
    return this.allChats().find(c => c.id === id) || null;
  });

  public enviarMensagem(content: string): void {
    const currentChat = this.chat();
    if (!currentChat || !content.trim()) return;

    this.chatServ.addMessage(currentChat.id, content.trim(), this.loggedInUserId()).subscribe({
      error: (err) => console.error(err)
    });
  }

  public getOtherParticipantName(chat: Chat): string {
    const other = chat.participants.find(p => p.id !== this.loggedInUserId());
    return other ? `${other.name} (${other.department.code})` : 'Setor Indefinido';
  }

  public getUrgencyLabel(urgency: 'low' | 'moderate' | 'high'): string {
    const labels = { high: 'ALTA', moderate: 'MÉDIA', low: 'BAIXA' };
    return labels[urgency] || '';
  }

  public voltarListagem(): void {
    this.router.navigate(['/chats']); 
  }
}