import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})

export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public loginForm: FormGroup;
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public passwordVisibility = 'password';
  public passwordVisibilityIcon = 'visibility'

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required], 
      rememberMe: [false]
    });
  }

  tooglePasswordVisibility(){
    if(this.passwordVisibility == "password"){
      this.passwordVisibility = 'text'
      this.passwordVisibilityIcon = 'visibility_off'
    } else {
      this.passwordVisibility = 'password';
      this.passwordVisibilityIcon = 'visibility'
    }
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password, rememberMe).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        console.log('Utilizador autenticado com sucesso:', user);
        
       this.router.navigate([user.isAdmin ? '/admin' : '/chats']); 
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Falha na autenticação:', err);
        
        this.errorMessage.set('E-mail ou senha incorretos. Por favor, tente novamente.');
      }
    });
  }
}
