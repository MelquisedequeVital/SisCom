import { Component, inject, signal } from '@angular/core';
import { AdminHeader } from "../admin-header/admin-header";
import { UserCard } from "./user-card/user-card";
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  imports: [UserCard],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement {
  private userServ = inject(UserService);
  public usersList = signal<User[]>([
    {
      id: 'SIS-001',
      name: 'Carlos Alberto Souza',
      email: 'carlos.souza@siscom.gov.br',
      phone: '(83) 99888-1122',
      isAdmin: true,
      active: true,
      createdAt: new Date('2024-01-15'),
      isManager: false,
      chats: [],
      department: {
        id: 'd1',
        name: 'Tecnologia da Informação',
        code: 'STI'
      }
    },
    {
      id: 'SIS-042',
      name: 'Ana Beatriz Ramos',
      email: 'ana.ramos@siscom.gov.br',
      phone: '(83) 98765-5544',
      isAdmin: false,
      active: true,
      createdAt: new Date('2024-06-20'),
      isManager: true,
      managedDepartment: {
        id: 'd2',
        name: 'Recursos Humanos',
        code: 'SERH'
      },
      chats: [],
      department: {
        id: 'd2',
        name: 'Recursos Humanos',
        code: 'SERH'
      }
    },
    {
      id: 'SIS-109',
      name: 'Ricardo Oliveira Lima',
      email: 'ricardo.lima@siscom.gov.br',
      phone: '(83) 99122-3344',
      isAdmin: false,
      active: false, // Usuário Afastado para testar o badge vermelho
      createdAt: new Date('2025-02-10'),
      isManager: false,
      chats: [],
      department: {
        id: 'd3',
        name: 'Departamento Financeiro',
        code: 'SEFIN'
      }
    }
  ]);

  abrirModalCadastro(): void {
    console.log('Abrir formulário de novo usuário');
  }

  editarUsuario(user: User): void {
    console.log('Editar usuário:', user);
  }

  async removerUsuario(id: string): Promise<void> {
    if (confirm('Deseja remover este servidor do sistema?')) {
      try {
        await this.userServ.deleteUser(id);
      } catch (error) {
        console.error(error);
      }
    }
  }


}
