import { Component, computed, inject, input, output, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../services/chat.service';
import { Chat } from '../../../models/chat.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Client, StompSubscription } from '@stomp/stompjs';
import { environment } from '../../../../environments/enviroment';

@Component({
  selector: 'app-active-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-chat-component.html',
})
export class ActiveChatComponent implements OnDestroy {
  private chatServ = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected readonly String = String;

  public chatId = input<string | null>(null);
  public isSidebarOpen = input<boolean>(true);
  public onToggleSidebar = output<void>();

  public loggedInUserId = computed(() => this.authService.currentUser()?.id || '');

  private allChats = this.chatServ.chats;


  public activeChatMessages = signal<any[]>([]);

  private stompClient: Client | null = null;
  private topicSubscription: StompSubscription | null = null;

  public chat = computed(() => {
    const id = this.chatId();
    if (!id) return null;
    return this.allChats().find(c => c.id === id) || null;
  });

  constructor() {
    effect(() => {
      const id = this.chatId();
      if (id) {
        this.inicializarChatComWebsocket(id);
      } else {
        this.desconectarWebsocket();
      }
    }, { allowSignalWrites: true });
  }

  private inicializarChatComWebsocket(id: string) {
    this.chatServ.getChatById(id).subscribe(chatAtualizado => {
      if (chatAtualizado && chatAtualizado.messages) {
        this.activeChatMessages.set(chatAtualizado.messages);
      }
    });


    this.desconectarWebsocket();

    this.stompClient = new Client({
      brokerURL: environment.websocketUrl,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Conectado ao WebSocket STOMP com sucesso!');

        this.topicSubscription = this.stompClient!.subscribe(`/queue/messages/${id}`, (message) => {
          const novaMensagem = JSON.parse(message.body);

          console.log("Comparando IDs -> Enviador vindo do Socket:", novaMensagem.senderId, " | Usuário Logado no Angular:", this.loggedInUserId());

          this.activeChatMessages.update(msgs => [...msgs, novaMensagem]);

          this.chatServ.appendMessageLocally(id, novaMensagem);

        });
      },
      onStompError: (frame) => {
        console.error('Erro no protocolo STOMP:', frame.headers['message']);
      }
    });
    this.stompClient.activate();
  }

  public enviarMensagem(content: string): void {
    const id = this.chatId();
    if (!id || !content.trim()) return;

    const meuUserId = this.loggedInUserId();
    console.log('Enviando mensagem como o usuário:', meuUserId); // Verifique se este ID não está vazio no console

    // Dispara para o serviço enviar via WebSocket
    this.chatServ.addMessage(this.stompClient, id, content.trim(), meuUserId);

  }

  private desconectarWebsocket() {
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
      this.topicSubscription = null;
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }

    this.activeChatMessages.set([]);
  }

  ngOnDestroy() {
    this.desconectarWebsocket();
  }

  public getOtherParticipantName(chat: Chat | null): string {
    if (!chat) return 'Carregando...';

    if (chat.requesterId === this.loggedInUserId()) {
      // SE EU FOR O REQUERENTE: O outro é o atendente do setor
      const nomeAtendente = chat.requestedUserName || 'Atendente';
      const nomeSetor = chat.requestedDepartmentName ? ` (${chat.requestedDepartmentName})` : '';
      return `${nomeAtendente}${nomeSetor}`;
    } else {
      // SE EU FOR O ATENDENTE: O outro é quem abriu a solicitação
      const nomeSolicitante = chat.requesterName || 'Usuário Solicitante';
      const nomeSetor = chat.requestedDepartmentName ? ` (${chat.requestedDepartmentName})` : '';
      return `${nomeSolicitante}${nomeSetor}`;
    }
  }

 public getUrgencyLabel(urgency: string): string {
  if (!urgency) return '';

  const normalized = urgency.toLowerCase(); 
  
  const labels: { [key: string]: string } = { 
    high: 'ALTA', 
    medium: 'MÉDIA',
    low: 'BAIXA' 
  };
  
  return labels[normalized] || urgency;
}

  public voltarListagem(): void {
    this.router.navigate(['/chats']);
  }
}