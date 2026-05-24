import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model'; 

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  protected passwordVisibilityIcon = "visibility";
  protected passwordVisibility = "password"

  cadastroForm: FormGroup;

  constructor() {
    this.cadastroForm = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      setor: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(12), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?]).+$')]],
      confirmarSenha: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha');
    const confirmarSenha = control.get('confirmarSenha');

    if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
      confirmarSenha.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
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

  onSubmit() {
    if (this.cadastroForm.valid) {
      const formData = this.cadastroForm.value;
    
      const novoUsuario: Omit<User, 'id'> = {
        name: formData.nomeCompleto,
        email: formData.email,
        password: formData.senha,
        department: { id: 'temp-id', name: formData.setor } as any, 
        isAdmin: false,
        active: true,
        createdAt: new Date(),
        isManager: false,
        chats: []
      };
      
      this.userService.addUser(novoUsuario).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (erro) => {
          console.error(erro);
        }
      });
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }
}