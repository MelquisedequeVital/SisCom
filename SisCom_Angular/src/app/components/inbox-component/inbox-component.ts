import { Component, computed, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { ActiveChatComponent } from './active-chat-component/active-chat-component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, ActiveChatComponent],
  templateUrl: './inbox-component.html',
})
export class InboxComponent implements OnInit {
  private chatServ = inject(ChatService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  public loggedInUserId = computed(() => this.authService.currentUser()?.id || '');
  public activeTab = signal<'requerido' | 'requerente'>('requerido');
  public activeChatId = signal<string | null>(null);

  public isSidebarOpen = signal<boolean>(true);

  private allChats = this.chatServ.chats;

  constructor() {

    effect(() => {
      const currentChatId = this.activeChatId();
      const chats = this.allChats();

      if (currentChatId && chats.length > 0) {
        const chatAberto = chats.find(c => c.id === currentChatId);

        if (chatAberto) {
          if (chatAberto.requesterId === this.loggedInUserId()) {
            this.activeTab.set('requerente');
          } else {
            this.activeTab.set('requerido');
          }
        }
      }
    });


    effect(() => {
      const userId = this.loggedInUserId();
      if (userId) {
        this.chatServ.loadChats(userId);
      }
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const chatId = params.get('id');
      this.activeChatId.set(chatId);
      if (chatId && typeof window !== 'undefined' && window.innerWidth < 768) {
        this.isSidebarOpen.set(false);
      }
    });

  }

  public chatsRequerente = computed(() => {
    return this.allChats().filter(chat => chat.requesterId === this.loggedInUserId());
  });

  public chatsRequerido = computed(() => {
    const meuId = this.loggedInUserId();
    
    return this.allChats().filter(chat =>
      chat.requesterId !== meuId && 
      (chat.participantIds || []).includes(meuId)
    );
  });

  public displayedChats = computed(() => {
    return this.activeTab() === 'requerido' ? this.chatsRequerido() : this.chatsRequerente();
  });

  public selecionarChat(chatId: string): void {
    this.router.navigate(['/chats', chatId]);

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.isSidebarOpen.set(false);
    }
  }

  public getOtherParticipantName(chat: Chat): string {
    if (!chat) return 'Setor Indefinido';

    // Se o utilizador logado for quem solicitou, mostra o nome do departamento requerido
    if (chat.requesterId === this.loggedInUserId()) {
      return chat.requestedDepartmentName || 'Setor Destino';
    } 
    
    // Se o utilizador logado for o atendente, mostra o nome de quem solicitou (requerente)
    return chat.requesterName || 'Usuário Solicitante';
  }

  public getUrgencyConfig(urgency: string) {
    if (!urgency) return { label: 'BAIXA', bg: 'bg-[#cbe7f5]', text: 'text-[#021f29]', border: 'border-l-[#59df89]' };

    const normalized = urgency.toLowerCase();

    switch (normalized) {
      case 'high':
        return { label: 'ALTA', bg: 'bg-[#ffdad6]', text: 'text-[#93000a]', border: 'border-l-[#ba1a1a]' };
      case 'medium': // Alterado de 'moderate' para 'medium'
        return { label: 'MÉDIA', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-l-amber-500' };
      case 'low':
        return { label: 'BAIXA', bg: 'bg-[#cbe7f5]', text: 'text-[#021f29]', border: 'border-l-[#59df89]' };
      default:
        return { label: 'BAIXA', bg: 'bg-[#cbe7f5]', text: 'text-[#021f29]', border: 'border-l-[#59df89]' };
    }
  }

  public navegar(rota: string): void {
    this.router.navigate([`/${rota}`]);
  }

  public getLastMessage(chat: Chat) {
    if (!chat.messages || chat.messages.length === 0) return null;
    return chat.messages[chat.messages.length - 1];
  }

  public toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }
}
