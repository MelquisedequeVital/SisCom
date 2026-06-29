import { inject, Injectable, signal } from '@angular/core';
import { Department } from '../models/department.model';
import { Observable, of, throwError } from 'rxjs'; // Adicionado throwError
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private api = inject(ApiService);
  private readonly API_URL = 'http://localhost:8080/api/siscom/departments';

  private departmentsSignal = signal<Department[]>([]);
  public departments = this.departmentsSignal.asReadonly();

  constructor() {
    this.loadDepartments();
    window.addEventListener('storage', (event) => {
      console.log('Outra aba modificou o banco!');
      this.loadDepartments();
    });
  }

  // Mantemos o subscribe aqui porque é uma chamada interna do constructor
  loadDepartments() {
    this.api.getAll<Department>("http://localhost:8080/api/siscom/departments/public-list").subscribe({
      next: (departments) => this.departmentsSignal.set(departments),
      error: (error) => console.error("Erro ao carregar departamentos do bd: ", error)
    });
  }


  // Agora retorna o Observable para o componente aguardar a criação
  addDepartment(department: Omit<Department, 'id'>) {
    return this.api.create<Department>(this.API_URL, department).pipe(
      tap((newDepartment) => {
        this.departmentsSignal.update(departments => [...departments, newDepartment]);
      })
    );
  }

  // Agora retorna o Observable para o componente aguardar a exclusão
  deleteDepartment(depId: string) {
    return this.api.delete<Department>(this.API_URL, depId).pipe(
      tap(() => {
        this.departmentsSignal.update(deps => deps.filter(dep => dep.id !== depId));
      })
    );
  }

  // Corrigido: Adicionado o "return" e o throwError para proteção
  updateDepartment(deptId: string, changedDept: Partial<Department>) {
    const current = this.departmentsSignal().find(dept => dept.id === deptId);
    
    if (!current) {
      // Usamos throwError para avisar o componente que o departamento não existe
      return throwError(() => new Error("Departamento não encontrado no cache local para atualização"));
    }

    const fullUpdatedData = { ...current, ...changedDept };
    
    // Agora tem o "return", entregando o Observable para o componente!
    return this.api.update<Department>(this.API_URL, deptId, fullUpdatedData).pipe(
      tap((updatedDepartment) => {
        this.departmentsSignal.update(depts => 
          depts.map(dept => dept.id === deptId ? updatedDepartment : dept)
        );
      })
    );
  }

  getDeptById(deptId: string): Observable<Department | undefined> {
    const cachedDept = this.departmentsSignal().find(dept => dept.id === deptId);
    
    if (cachedDept) {
      return of(cachedDept);
    }

    return this.api.getById<Department>(this.API_URL, deptId).pipe(
      catchError((error) => {
        console.error(`Erro ao buscar departamento com ID ${deptId}:`, error);
        return of(undefined);
      })
    );
  }
}