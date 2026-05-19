import { inject, Injectable, signal } from '@angular/core';
import { Department } from '../models/department.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private api = inject(ApiService);
  private readonly API_URL = 'http://localhost:4200/api/departments';

  private departmentsSignal = signal<Department[]>([]);
  public departments = this.departmentsSignal.asReadonly();

  constructor() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.api.getAll<Department>(this.API_URL).subscribe({
      next: (departments) => this.departmentsSignal.set(departments),
      error: (error) => console.error("Erro ao carregar departamentos do bd: ", error)
    });
  }

  addDepartment(department: Omit<Department, 'id'>) {
    this.api.create<Department>(this.API_URL, department).subscribe({
      next: (newDepartment) => {
        this.departmentsSignal.update(departments => [...departments, newDepartment]);
      },
      error: (error) => console.error("Erro ao adicionar departamento: ", error)
    });
  }

  deleteDepartment(depId: string) {
    this.api.delete<Department>(this.API_URL, depId).subscribe({
      next: () => {
        this.departmentsSignal.update(deps => deps.filter(dep => dep.id !== depId));
      },
      error: (error) => console.error("Erro ao deletar departamento: ", error)
    });
  }

  updateDepartment(deptId: string, changedDept: Partial<Department>) {
    const current = this.departmentsSignal().find(dept => dept.id === deptId);
    
    if (!current) {
      console.error("Departamento não encontrado no cache local para atualização");
      return;
    }

    const fullUpdatedData = { ...current, ...changedDept };
    
    this.api.update<Department>(this.API_URL, deptId, fullUpdatedData).subscribe({
      next: (updatedDepartment) => {
        this.departmentsSignal.update(depts => 
          depts.map(dept => dept.id === deptId ? updatedDepartment : dept)
        );
      },
      error: (error) => console.error("Erro ao atualizar departamento: ", error)
    });
  }

  getDeptById(deptId: string): Observable<Department | undefined> {
    const cachedDept = this.departmentsSignal().find(dept => dept.id === deptId);
    
    // Retorna do Signal instantaneamente se já estiver em cache
    if (cachedDept) {
      return of(cachedDept);
    }

    // Caso contrário, busca pela API com tratamento de erro
    return this.api.getById<Department>(this.API_URL, deptId).pipe(
      catchError((error) => {
        console.error(`Erro ao buscar departamento com ID ${deptId}:`, error);
        return of(undefined);
      })
    );
  }
}