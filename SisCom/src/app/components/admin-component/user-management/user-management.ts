import { Component, inject, signal } from '@angular/core';
import { UserCard } from "./user-card/user-card";
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { UserModal } from "./user-modal/user-modal";
import { DepartmentService } from '../../../services/department.service';


@Component({
  selector: 'app-user-management',
  imports: [UserCard, UserModal],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement {
  private userServ = inject(UserService);
  private deptServ = inject(DepartmentService)
  public usersList = this.userServ.users;
  public departmentsList = this.deptServ.departments;

  public isModalOpen = signal<boolean>(false);
  public userToEdit = signal<User | null>(null);

  abrirModalCadastro(): void {
    this.userToEdit.set(null);
    this.isModalOpen.set(true)
  }

  editarUsuario(user: User): void {
    this.userToEdit.set(user);
    this.isModalOpen.set(true);
  }

  public fecharModal(): void {
    this.isModalOpen.set(false);
    this.userToEdit.set(null);
  }

  public gravarDados(userData: Partial<User>): void {
    if (userData.id) {
      this.userServ.updateUser(userData.id, userData).subscribe({
        next: () => this.fecharModal(),
        error: (err) => console.error('Erro ao atualizar usuário:', err)
      });
    } else {

      const newUser: Omit<User, 'id'> = {
        name: userData.name!,
        email: userData.email!,
        department: userData.department!,
        isAdmin: userData.isAdmin || false,
        isManager: userData.isManager || false,
        active: userData.active ?? true,
        phone: userData.phone,
        password: 'senha-padrao-provisoria',
        createdAt: new Date(),
        chats: [],
      }

      this.userServ.addUser(newUser).subscribe({
        next: () => this.fecharModal(),
        error: (err) => console.error('Erro ao cadastrar usuário:', err)
      });
    }

  }

  removerUsuario(id: string) {
    if (confirm('Deseja remover este servidor do sistema?')) {
 
        this.userServ.deleteUser(id).subscribe({
          next: () => console.log('Usuário removido com sucesso'),
          error: (err) => console.error('Erro ao remover usuário:', err)
        });
  
    }
  }


}
