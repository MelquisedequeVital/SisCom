import { User } from "../app/models/user.model";
import { Department } from "../app/models/department.model";
import { Chat } from "../app/models/chat.model";
import { Meeting } from "../app/models/meeting.model";

// 1. DEPARTAMENTOS
export const INITIAL_DEPARTMENTS: Department[] = [
    { id: 'd1', name: 'Tecnologia da Informação', code: 'STI' },
    { id: 'd2', name: 'Recursos Humanos', code: 'SERH' },
    { id: 'd3', name: 'Departamento Financeiro', code: 'SEFIN' }
];

// 2. UTILIZADORES (Com os IDs dos chats e meetings correspondentes adicionados)
export const INITIAL_USERS: User[] = [
    // --- ADMINISTRADORES ---
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
        chats: ['chat-101', 'chat-105'],
        meetings: ['meet-1', 'meet-4'],
        department: INITIAL_DEPARTMENTS[0]
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
        managedDepartment: INITIAL_DEPARTMENTS[1],
        chats: ['chat-102'],
        meetings: ['meet-2', 'meet-4'],
        department: INITIAL_DEPARTMENTS[1]
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
        chats: ['chat-103'],
        meetings: ['meet-1', 'meet-3'],
        department: INITIAL_DEPARTMENTS[0]
    },

    // --- UTILIZADORES COMUNS ---
    {
        id: 'SIS-004',
        name: 'Ana Clara Silva',
        email: 'ana.silva@siscom.gov.br',
        phone: '(83) 98888-4444',
        password: '123',
        isAdmin: false,
        active: true,
        createdAt: new Date('2026-04-05'),
        isManager: false,
        chats: ['chat-103', 'chat-104', 'chat-105'],
        meetings: ['meet-2', 'meet-3'],
        department: INITIAL_DEPARTMENTS[2]
    },
    {
        id: 'SIS-005',
        name: 'Carlos Eduardo Mendes',
        email: 'carlos.mendes@siscom.gov.br',
        phone: '(83) 98888-5555',
        password: '123',
        isAdmin: false,
        active: true,
        createdAt: new Date('2026-01-22'),
        isManager: true,
        managedDepartment: INITIAL_DEPARTMENTS[2],
        chats: [],
        meetings: ['meet-3', 'meet-4'],
        department: INITIAL_DEPARTMENTS[2]
    },
    {
        id: 'SIS-006',
        name: 'Beatriz Costa',
        email: 'beatriz.costa@siscom.gov.br',
        phone: '(83) 98888-6666',
        password: '123',
        isAdmin: false,
        active: true,
        createdAt: new Date('2026-05-12'),
        isManager: false,
        chats: ['chat-101', 'chat-104'],
        meetings: ['meet-2'],
        department: INITIAL_DEPARTMENTS[1]
    },
    {
        id: 'SIS-007',
        name: 'Roberto Nunes',
        email: 'roberto.nunes@siscom.gov.br',
        phone: '(83) 98888-7777',
        password: '123',
        isAdmin: false,
        active: false,
        createdAt: new Date('2026-02-01'),
        isManager: false,
        chats: ['chat-102'],
        meetings: ['meet-1'],
        department: INITIAL_DEPARTMENTS[0]
    }
];

// 3. CHATS
export const INITIAL_CHATS: Chat[] = [
    {
        id: 'chat-101',
        subject: 'Problema no acesso ao sistema de ponto',
        urgency: 'high',
        requesterId: 'SIS-006',
        requestedDepartmentId: 'd1',
        participants: [INITIAL_USERS[5], INITIAL_USERS[0]],
        messages: [
            {
                id: 'msg-1',
                content: 'Bom dia. Não estou conseguindo acessar o sistema de ponto desde as 08:00.',
                senderID: 'SIS-006',
                timestamp: new Date('2026-05-20T08:15:00'),
                isRead: true
            },
            {
                id: 'msg-2',
                content: 'Bom dia, Beatriz. Vou verificar as suas permissões de acesso agora mesmo.',
                senderID: 'SIS-001',
                timestamp: new Date('2026-05-20T08:20:00'),
                isRead: true
            }
        ],
        get lastMessage() { return this.messages[this.messages.length - 1]; }
    },
    {
        id: 'chat-102',
        subject: 'Dúvida sobre o deferimento do atestado',
        urgency: 'moderate',
        requesterId: 'SIS-007',
        requestedDepartmentId: 'd2',
        participants: [INITIAL_USERS[6], INITIAL_USERS[1]],
        messages: [
            {
                id: 'msg-3',
                content: 'Olá. Podem confirmar se o meu atestado médico, enviado na semana passada, já foi deferido?',
                senderID: 'SIS-007',
                timestamp: new Date('2026-05-19T14:30:00'),
                isRead: true
            },
            {
                id: 'msg-4',
                content: 'Olá Roberto. Sim, o atestado foi validado hoje de manhã. O sistema já está atualizado.',
                senderID: 'SIS-002',
                timestamp: new Date('2026-05-19T15:10:00'),
                isRead: false
            }
        ],
        get lastMessage() { return this.messages[this.messages.length - 1]; }
    },
    {
        id: 'chat-103',
        subject: 'Encaminhamento de fatura dos servidores Cloud',
        urgency: 'low',
        requesterId: 'SIS-003',
        requestedDepartmentId: 'd3',
        participants: [INITIAL_USERS[2], INITIAL_USERS[3]],
        messages: [
            {
                id: 'msg-5',
                content: 'Boa tarde, Ana. Segue a nota fiscal referente à renovação dos servidores AWS deste mês.',
                senderID: 'SIS-003',
                timestamp: new Date('2026-05-18T16:00:00'),
                isRead: true
            },
            {
                id: 'msg-6',
                content: 'Recebido, Victor! Já coloquei na fila de pagamentos para amanhã.',
                senderID: 'SIS-004',
                timestamp: new Date('2026-05-18T16:45:00'),
                isRead: true
            }
        ],
        get lastMessage() { return this.messages[this.messages.length - 1]; }
    },
    {
        id: 'chat-104',
        subject: 'Divergência no cálculo de horas extra',
        urgency: 'high',
        requesterId: 'SIS-004',
        requestedDepartmentId: 'd2',
        participants: [INITIAL_USERS[3], INITIAL_USERS[5]],
        messages: [
            {
                id: 'msg-7',
                content: 'Beatriz, detectamos uma divergência no cálculo das horas extra do setor de engenharia. Podem verificar a folha de ponto?',
                senderID: 'SIS-004',
                timestamp: new Date('2026-05-20T09:00:00'),
                isRead: false
            }
        ],
        get lastMessage() { return this.messages[this.messages.length - 1]; }
    }
];

// 4. REUNIÕES (MEETINGS)
export const INITIAL_MEETINGS: Meeting[] = [
    {
        id: 'meet-1',
        title: 'Daily TI (Sincronização Diária)',
        description: 'Reunião diária de alinhamento da equipe de Tecnologia da Informação.',
        startTime: new Date('2026-05-26T09:00:00'),
        endTime: new Date('2026-05-26T09:30:00'),
        isRemote: true,
        meetingLink: true,
        organizer: INITIAL_USERS[0], // Melquisedeque
        participants: [INITIAL_USERS[0], INITIAL_USERS[2], INITIAL_USERS[6]] // Melquisedeque, Victor, Roberto (3 utilizadores)
    },
    {
        id: 'meet-2',
        title: 'Alinhamento de Processos RH',
        description: 'Revisão dos fluxos de avaliação de desempenho e atestados médicos.',
        startTime: new Date('2026-05-27T14:00:00'),
        endTime: new Date('2026-05-27T15:30:00'),
        location: 'Sala de Reuniões 02 - Bloco B',
        isRemote: false,
        organizer: INITIAL_USERS[1], // Ludmilla
        participants: [INITIAL_USERS[1], INITIAL_USERS[5], INITIAL_USERS[3]] // Ludmilla, Beatriz, Ana Clara (3 utilizadores)
    },
    {
        id: 'meet-3',
        title: 'Fechamento Financeiro Mensal',
        description: 'Aprovação de faturas em aberto e planejamento orçamentário para o próximo mês.',
        startTime: new Date('2026-05-28T10:00:00'),
        endTime: new Date('2026-05-28T11:30:00'),
        location: 'Sala de Reuniões 01 - Bloco C',
        isRemote: false,
        organizer: INITIAL_USERS[4], // Carlos Eduardo
        participants: [INITIAL_USERS[4], INITIAL_USERS[3], INITIAL_USERS[2]] // Carlos Eduardo, Ana Clara, Victor (3 utilizadores)
    },
    {
        id: 'meet-4',
        title: 'Comitê Geral de Gestores',
        description: 'Alinhamento estratégico entre as lideranças de TI, RH e Financeiro.',
        startTime: new Date('2026-05-29T15:00:00'),
        endTime: new Date('2026-05-29T16:00:00'),
        isRemote: true,
        meetingLink: true,
        organizer: INITIAL_USERS[0], // Melquisedeque
        participants: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[4]] // Melquisedeque, Ludmilla, Carlos (3 utilizadores)
    }
];