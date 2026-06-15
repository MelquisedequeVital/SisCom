import { Component, inject, signal } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department.model';
import { DeptCard } from './dept-card/dept-card';
import { DeptModal } from './dept-modal/dept-modal';

@Component({
  selector: 'app-department-management',
  imports: [DeptCard, DeptModal],
  templateUrl: './department-management.html',
  styleUrl: './department-management.css',
})
export class DepartmentManagement {
  private deptServ = inject(DepartmentService)
  public departmentsList = this.deptServ.departments;

  public isModalOpen = signal<boolean>(false);
  public deptToEdit = signal<Department | null>(null);

  abrirModalCadastro(): void {
    this.deptToEdit.set(null);
    this.isModalOpen.set(true)
  }

  editarDepartamento(dept: Department): void {
    this.deptToEdit.set(dept);
    this.isModalOpen.set(true);
  }

  public fecharModal(): void {
    this.isModalOpen.set(false);
    this.deptToEdit.set(null);
  }

  public gravarDados(deptData: Partial<Department>): void {
    if (deptData.id) {
      this.deptServ.updateDepartment(deptData.id, deptData).subscribe({
        next: () => this.fecharModal(),
        error: (err) => console.error('Erro ao atualizar departamento', err)
      });
    } else {
      
      const newDepartment: Omit<Department, 'id'> = {
        name: deptData.name!,
        code: deptData.code!
      }

      this.deptServ.addDepartment(newDepartment).subscribe({
        next: () => this.fecharModal(),
        error: (err) => console.error('Erro ao adicionar departamento', err)
      });
    }

  }

  removerDepartamento(id: string) {
    if (confirm('Deseja remover este departamento do sistema?')) {
        this.deptServ.deleteDepartment(id).subscribe({
        next: () => console.log('Departamento removido com sucesso'),
        error: (err) => console.error('Erro ao remover departamento:', err)
      });;
    }
  }
}
