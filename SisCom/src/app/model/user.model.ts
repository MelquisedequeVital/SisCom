import { Department } from "./department.model";

export interface User {
    id?: string;
    name: string;
    department: Department;
    email: string;
    password?: string;
    isAdmin: boolean;
    active: boolean;        // Útil em órgãos públicos para usuários afastados/desativados
    createdAt: Date;        // Importante para auditoria
    phone?: string;         // Opcional, mas comum em órgãos públicos para contatos rápidos
}
