import { inject, Injectable, signal } from '@angular/core';
import { Department } from '../models/department.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private api = inject(ApiService);
  // Mantém a URL base centralizada
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

  loadDepartments() {
    // Ajuste: Utiliza o this.API_URL concatenado com a rota pública
    this.api.getAll<Department>(`${this.API_URL}/public-list`).subscribe({
      next: (departments) => this.departmentsSignal.set(departments),
      error: (error) => console.error("Erro ao carregar departamentos do bd: ", error)
    });
  }

  // Novo: Método direto para a tela de Cadastro ou Login, garantindo que a requisição
  // seja feita exatamente no momento em que o usuário abrir a tela.
  getPublicDepartments(): Observable<Department[]> {
    return this.api.getAll<Department>(`${this.API_URL}/public-list`);
  }

  addDepartment(department: Omit<Department, 'id'>) {
    return this.api.create<Department>(this.API_URL, department).pipe(
      tap((newDepartment) => {
        this.departmentsSignal.update(departments => [...departments, newDepartment]);
      })
    );
  }

  deleteDepartment(depId: string) {
    return this.api.delete<Department>(this.API_URL, depId).pipe(
      tap(() => {
        this.departmentsSignal.update(deps => deps.filter(dep => dep.id !== depId));
      })
    );
  }

  updateDepartment(deptId: string, changedDept: Partial<Department>) {
    const current = this.departmentsSignal().find(dept => dept.id === deptId);
    
    if (!current) {
      return throwError(() => new Error("Departamento não encontrado no cache local para atualização"));
    }

    const fullUpdatedData = { ...current, ...changedDept };
    
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

    // Como o getById não é uma rota pública na API, ele usará o token de autenticação
    return this.api.getById<Department>(this.API_URL, deptId).pipe(
      catchError((error) => {
        console.error(`Erro ao buscar departamento com ID ${deptId}:`, error);
        return of(undefined);
      })
    );
  }
}