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

  private allChats = this.chatServ.chats;

  constructor() {
    // O effect fica a observar: se a URL tem um ID e os chats já carregaram,
    // ele descobre de quem é o chat e abre a aba certa automaticamente!
    effect(() => {
      const currentChatId = this.activeChatId();
      const chats = this.allChats();

      if (currentChatId && chats.length > 0) {
        const chatAberto = chats.find(c => c.id === currentChatId);

        if (chatAberto) {
          if (chatAberto.requesterId === this.loggedInUserId()) {
            this.activeTab.set('requerente'); // Fui eu que criei, vai para "Eu Solicitei"
          } else {
            this.activeTab.set('requerido'); // Foi outro, vai para "Fui Requerido"
          }
        }
      }
    }); 
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.activeChatId.set(params.get('id'));
    });

  }

  public chatsRequerente = computed(() => {
    return this.allChats().filter(chat => chat.requesterId === this.loggedInUserId());
  });

  public chatsRequerido = computed(() => {
    return this.allChats().filter(chat =>
      chat.requesterId !== this.loggedInUserId() &&
      (chat.participants || []).some(p => p?.id === this.loggedInUserId())
    );
  });

  public displayedChats = computed(() => {
    return this.activeTab() === 'requerido' ? this.chatsRequerido() : this.chatsRequerente();
  });

  public selecionarChat(chatId: string): void {
    this.router.navigate(['/chats', chatId]);
  }

  public getOtherParticipantName(chat: Chat): string {
    // PROTEÇÃO ADICIONADA AQUI TAMBÉM
    const other = (chat.participants || []).find(p => p?.id !== this.loggedInUserId());

    if (other && other.department) {
      return `${other.name} (${other.department.code})`;
    }

    return other?.name || 'Setor Indefinido';
  }

  public getUrgencyConfig(urgency: 'low' | 'moderate' | 'high') {
    switch (urgency) {
      case 'high':
        return { label: 'ALTA', bg: 'bg-[#ffdad6]', text: 'text-[#93000a]', border: 'border-l-[#ba1a1a]' };
      case 'moderate':
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

}
