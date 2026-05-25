import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat.model';
import { DepartmentService } from '../../services/department.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private chatServ = inject(ChatService); // Injeção do novo serviço
  private deptServ = inject(DepartmentService);
  private userServ = inject(UserService);
  private authService = inject(AuthService);

  enviando = signal(false);
  public loggedInUserId = computed(() => this.authService.currentUser()?.id || '');
  public departments = this.deptServ.departments;

  form = this.fb.group({
    sector: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(10)]],
    urgencia: ['moderate', Validators.required],
    mensagem: ['', [Validators.required, Validators.minLength(10)]]
  });

  enviarSolicitacao() {
    if (this.form.invalid) return;

    this.enviando.set(true);
    const requesterId = this.loggedInUserId();
    const rawValues = this.form.value;

    // 1. PRIMEIRO PASSO: Valida o usuário logado com o método seguro
    this.userServ.getUserById(requesterId).subscribe({
      next: (currentUser) => {

        // Se a API retornar indefinido/nulo, o usuário não existe no banco
        if (!currentUser) {
          this.enviando.set(false);
          alert('Erro de Autenticação: O usuário solicitante não foi encontrado no sistema.');
          return;
        }

        const targetUser = this.userServ.users().find(
          u => u.department?.id === rawValues.sector && u.id !== requesterId
        );

        if (!targetUser) {
          this.enviando.set(false);
          alert('Aviso: Não foi encontrado nenhum atendente cadastrado para este departamento.');
          return;
        }

        const novaSolicitacao: Omit<Chat, 'id'> = {
          subject: rawValues.motivo!,
          urgency: rawValues.urgencia as 'low' | 'moderate' | 'high',
          requesterId: requesterId,
          requestedDepartmentId: rawValues.sector!,
          
          participants: [currentUser, targetUser], 
          
          messages: [
            {
              id: crypto.randomUUID(),
              content: rawValues.mensagem! || 'Nova solicitação aberta.',
              senderID: requesterId,
              timestamp: new Date(),
              isRead: true // O remetente já inicia com a mensagem lida por ele
            }
          ]
        };

        this.chatServ.addChat(novaSolicitacao).subscribe({
          next: (chatCriado) => {
            this.enviando.set(false);
            
            this.router.navigate(['/chats', chatCriado.id]);
          },
          error: (erro) => {
            this.enviando.set(false);
            console.error('Falha na API ao criar chat:', erro);
            alert('Não foi possível enviar a solicitação. Verifique sua conexão e tente novamente.');
          }
        });

      },
      error: (erro) => {
        this.enviando.set(false);
        console.error('Falha na API ao validar usuário:', erro);
        alert('Erro ao validar seu usuário. Tente novamente.');
      }
    });
  }

  navegar(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
}
