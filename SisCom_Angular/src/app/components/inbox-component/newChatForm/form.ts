import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { DepartmentService } from '../../../services/department.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private chatServ = inject(ChatService);
  private deptServ = inject(DepartmentService);
  private authService = inject(AuthService);

  enviando = signal(false);
  public loggedInUserId = computed(() => this.authService.currentUser()?.id || '');
  public departments = this.deptServ.departments;

  form = this.fb.group({
    sector: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(10)]],
    urgencia: ['MEDIUM', Validators.required], 
    mensagem: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.deptServ.loadDepartments();
  }

  enviarSolicitacao() {
    if (this.form.invalid) return;

    this.enviando.set(true);
    const rawValues = this.form.value;

  
    const chatCreateDTO = {
      subject: rawValues.motivo!,
      urgency: rawValues.urgencia!,
      requesterId: this.loggedInUserId(),
      requestedDepartmentId: rawValues.sector!,
      firstMessage: rawValues.mensagem!
    };

    this.chatServ.addChat(chatCreateDTO as any).subscribe({
      next: (chatCriado) => {
        this.enviando.set(false);
        this.router.navigate(['/chats', chatCriado.id]);
      },
      error: (erro) => {
        this.enviando.set(false);
        console.error('Falha na API ao criar chat:', erro);
        alert('Não foi possível enviar a solicitação. Verifique os dados e tente novamente.');
      }
    });
  }

  navegar(rota: string) {
    this.router.navigate([`/${rota}`]);
  }
}