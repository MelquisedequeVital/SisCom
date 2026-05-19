import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

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
  private http = inject(HttpClient);
  
  enviando = signal<boolean>(false);

  form = this.fb.group({
    motivo: ['', Validators.required, Validators.minLength(10)],
    urgencia: ['media', Validators.required],
  });

    // REQUISITO: Requisição assíncrona com HttpClient
    enviarSolicitacao() {
      if (this.form.invalid) return;

      this.enviando.set(true);
      
      const payload = this.form.value;

      this.http.post('https://api.siscom.com/solicitacoes', payload)
        .pipe(
          finalize(() => this.enviando.set(false))
        )
        .subscribe({
          next: (resposta) => {
            console.log('Solicitação criada com sucesso!', resposta);
            // Retorna para a tela de conversas/dashboard
            this.navegar('conversas');
          },
          error: (erro) => {
            console.error('Erro ao enviar solicitação:', erro);
            // Mock para funcionar no front mesmo sem o backend rodando ainda:
            alert('Mock: Enviado com sucesso (modo de desenvolvimento sem API)!');
            this.navegar('conversas');
          }
        });
    }

    navegar(rota: string) {
      this.router.navigate([`/${rota}`]);
    }
}
