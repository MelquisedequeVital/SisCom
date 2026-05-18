import { Component, inject, signal } from '@angular/core';
import { AdminHeader } from "../admin-header/admin-header";
import { UserCard } from "./user-card/user-card";
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserModal } from "./user-modal/user-modal";
import { DepartmentService } from '../../services/department.service';

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
      this.userServ.updateUser(userData.id, userData)
    } else {
      this.userServ.addUser(userData as Omit<User, 'id'>)
    }

    this.fecharModal();
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
