
import { User } from "../app/models/user.model";
import { Department } from "../app/models/department.model";

export const INITIAL_DEPARTMENTS: Department[] = [
    { id: 'd1', name: 'Tecnologia da Informação', code: 'STI' },
    { id: 'd2', name: 'Recursos Humanos', code: 'SERH' },
    { id: 'd3', name: 'Departamento Financeiro', code: 'SEFIN' }
];

export const INITIAL_USERS: User[] = [ // Alterado para any[] temporariamente caso seu modelo User ainda não tenha o campo password
    {
        id: 'SIS-001',
        name: 'Melquisedeque Vital',
        email: 'melquisedeque.vital@siscom.gov.br',
        phone: '(83) 99999-1111',
        password: '123',
        isAdmin: true,
        active: true,
        createdAt: new Date('2026-01-10'),
        isManager: false,
        chats: [],
        department: { id: 'd1', name: 'Tecnologia da Informação', code: 'STI' }
    },
    {
        id: 'SIS-002',
        name: 'Ludmilla Maroja',
        email: 'ludmilla.maroja@siscom.gov.br',
        phone: '(83) 99999-2222',
        password: '123',
        isAdmin: true,
        active: true,
        createdAt: new Date('2026-02-15'),
        isManager: true,
        chats: [],
        department: { id: 'd2', name: 'Recursos Humanos', code: 'SERH' }
    },
    {
        id: 'SIS-003',
        name: 'Victor Belfort',
        email: 'victor.belfort@siscom.gov.br',
        phone: '(83) 99999-3333',
        password: '123',
        isAdmin: true,
        active: true,
        createdAt: new Date('2026-03-20'),
        isManager: false,
        chats: [],
        department: { id: 'd1', name: 'Tecnologia da Informação', code: 'STI' }
    }
];