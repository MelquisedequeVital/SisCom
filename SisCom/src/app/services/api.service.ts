import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  /**
   * Retorna uma lista de itens (GET)
   * @param url A URL base da requisição
   */
  getAll<T>(url: string): Observable<T[]> {
    return this.http.get<T[]>(url);
  }

  /**
   * Retorna um item específico pelo ID (GET)
   * @param url A URL base da requisição
   * @param id O identificador único do item
   */
  getById<T>(url: string, id: string): Observable<T> {
    return this.http.get<T>(`${url}/${id}`);
  }

  /**
   * Cria um novo item (POST)
   * @param url A URL base da requisição
   * @param body O objeto a ser criado (Omit<Model, 'id'>)
   */
  create<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  /**
   * Atualiza um item existente (PUT)
   * @param url A URL base da requisição
   * @param id O identificador único do item
   * @param body O objeto com os dados atualizados
   */
  update<T>(url: string, id: string, body: any): Observable<T> {
    return this.http.put<T>(`${url}/${id}`, body);
  }

  /**
   * Deleta um item existente (DELETE)
   * @param url A URL base da requisição
   * @param id O identificador único do item
   */
  delete<T>(url: string, id: string): Observable<T> {
    return this.http.delete<T>(`${url}/${id}`);
  }
}
