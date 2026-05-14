import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4200/api/users';

  private usersSignal = signal<User[]>([]);
  public users = this.usersSignal.asReadonly();

  constructor() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const data = await firstValueFrom(this.http.get<User[]>(this.apiUrl));
      this.usersSignal.set(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }

  async addUser(user: User) {
    try {
      const newUser = await firstValueFrom(this.http.post<User>(this.apiUrl, user));
      this.usersSignal.update(oldUsers => [...oldUsers, newUser]);
      return newUser;
    } catch (error) {
      throw error
    }
  }

  async updateUser(id: string, userData: Partial<User>) {
    try {
      const updatedUser = await firstValueFrom(this.http.put<User>(`${this.apiUrl}/${id}`, userData));
      this.usersSignal.update(users =>
        users.map(u => u.id === id ? updatedUser : u)
      )
    } catch (error) {
      console.error('Erro ao atualizar usuário no SisCom:', error);
    }
  }

  async deleteUser(id: string){
    try{
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
      this.usersSignal.update(users =>
        users.filter(u => u.id !== id)
      );
    } catch (error) {
      throw console.error("Erro ao deletar usuário: ", error);
    }
  }

  async getUserById(id: string): Promise<User | undefined>{
    const cachedUser = this.usersSignal().find(u => u.id === id);
    if(cachedUser) return cachedUser;

    try{
      return await firstValueFrom(this.http.get<User>(`${this.apiUrl}/${id}`));
    } catch(error){
      return undefined;
    }

  }
}
