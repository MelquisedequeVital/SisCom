import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat.model';

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

  enviando = signal(false);

  form = this.fb.group({
    // CORREÇÃO: Validadores síncronos agrupados em uma array []
    motivo: ['', [Validators.required, Validators.minLength(10)]],
    // AJUSTE: Valor inicial alterado para 'moderate' para casar com o modelo Chat
    urgencia: ['moderate', Validators.required],
  });

  enviarSolicitacao() {
    if (this.form.invalid) return;

    // Você pode voltar a usar o estado de "enviando" para desabilitar o botão aqui
    this.enviando.set(true);

    const rawValues = this.form.value;

    const novaSolicitacao: Omit<Chat, 'id'> = {
      subject: rawValues.motivo!,
      urgency: rawValues.urgencia as 'low' | 'moderate' | 'high',
      messages: [],
      participants: []
    };

    // Agora o componente SE INSCREVE e aguarda o resultado
    this.chatServ.addChat(novaSolicitacao).subscribe({
      next: () => {
        // SUCESSO: O Signal já foi atualizado pelo serviço. Agora sim, redireciona!
        this.enviando.set(false);
        this.navegar('conversas');
      },
      error: (erro) => {
        // ERRO: O redirecionamento NÃO acontece.
        this.enviando.set(false);
        console.error('Falha na API:', erro);
        alert('Não foi possível enviar a solicitação. Verifique sua conexão e tente novamente.');
      }
    });
  }

  navegar(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
}