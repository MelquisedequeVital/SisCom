import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Department } from '../models/department.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:4200/api/departments';

  private departmentsSignal = signal<Department[]>([]);
  public departments = this.departmentsSignal.asReadonly();

  constructor() {
    this.loadDepartments();
  }

  async loadDepartments() {
    try {
      const departments = await firstValueFrom(this.http.get<Department[]>(this.API_URL));
      this.departmentsSignal.set(departments)
    } catch (error) {
      console.error("Erro ao carregar departamentos do bd: ", error);
      throw error
    }
  }

  async addDepartment(department: Omit<Department, 'id'>) {
    try {
      const newDepartment = await firstValueFrom(this.http.post<Department>(this.API_URL, department));
      this.departmentsSignal.update(departments => [...departments, newDepartment]);
    } catch (error) {
      console.error("Erro ao adicionar departamento: ", error);
      throw error
    }
  }

  async deleteDepartment(depId: string) {
    try {
      await firstValueFrom(this.http.delete(`${this.API_URL}/${depId}`));
      this.departmentsSignal.update(deps => deps.filter(dep => dep.id !== depId))
    } catch (error) {
      console.error("Erro ao deletar departamento: ", error);
      throw error
    }
  }

  async updateDepartment(deptId: string, changedDept: Omit<Department, 'id'>){
    try{
      const updatedDepartment = await firstValueFrom(this.http.put<Department>(`${this.API_URL}/${deptId}`, changedDept ));
      this.departmentsSignal.update(depts => 
        depts.map(dept => dept.id === deptId ? updatedDepartment : dept)
      )
    } catch (error){
      console.error("Erro ao atualizar departamento: ", error);
      throw error
    }
  }

  async getDeptById(deptId: string){
    const cachedDept = this.departmentsSignal().find(dept => dept.id === deptId);
    if(!cachedDept) return;

    try {
      return await firstValueFrom(this.http.get(`${this.API_URL}/${deptId}`));
    } catch (error) {
      return undefined
    }
  }
}
