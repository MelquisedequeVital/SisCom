import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {
  // Injeções de Dependência modernas usando inject()
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // FormGroup do formulário
  public loginForm: FormGroup;

  // Signals para controlo reativo da Interface de Utilizador (UI)
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // Nota: Alterado minLength para 3 pois as senhas do mock costumam ser curtas (ex: '123')
      password: ['', [Validators.required, Validators.minLength(3)]], 
      rememberMe: [false]
    });
  }

  public onSubmit(): void {
    // Proteção: Se o formulário estiver inválido, marca os campos para mostrar os erros visuais
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Ativa o estado de carregamento e limpa erros antigos
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Extrai os valores validados do formulário
    const { email, password, rememberMe } = this.loginForm.value;

    // Dispara a autenticação através do AuthService
    this.authService.login(email, password, rememberMe).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        console.log('Utilizador autenticado com sucesso:', user);
        
        // Redireciona o utilizador para a página principal (Inbox ou Dashboard)
        this.router.navigate(['/chats']); 
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Falha na autenticação:', err);
        
        // Define a mensagem de erro que será exibida dinamicamente no HTML
        this.errorMessage.set('E-mail ou senha incorretos. Por favor, tente novamente.');
      }
    });
  }
}