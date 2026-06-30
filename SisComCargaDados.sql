-- Criando a tabela Department primeiro (já que outras dependem dela)
CREATE TABLE department (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL
);

-- Criando a tabela de Usuários (mapeada explicitamente como 'servidor_publico')
CREATE TABLE servidor_publico (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20), -- Coluna de telefone adicionada
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    department_id UUID NOT NULL,
    managed_department_id UUID,
    FOREIGN KEY (department_id) REFERENCES department(id),
    FOREIGN KEY (managed_department_id) REFERENCES department(id)
);

-- Tabela de Roles (mapeada a partir de @ElementCollection em User)
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, role_name),
    FOREIGN KEY (user_id) REFERENCES servidor_publico(id)
);

-- Criando a tabela Chat
CREATE TABLE chat (
    id UUID PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    urgency VARCHAR(50) NOT NULL, -- Enum mapeado implicitamente como String/Ordinal
    requester_id UUID NOT NULL,
    requested_department_id UUID NOT NULL,
    FOREIGN KEY (requester_id) REFERENCES servidor_publico(id),
    FOREIGN KEY (requested_department_id) REFERENCES department(id)
);

-- Tabela de relacionamento ManyToMany entre Chat e User (Participants)
CREATE TABLE chat_participants (
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chat(id),
    FOREIGN KEY (user_id) REFERENCES servidor_publico(id)
);

-- Criando a tabela Message
CREATE TABLE message (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    is_read BOOLEAN NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    sender_id UUID NOT NULL,
    chat_id UUID NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES servidor_publico(id),
    FOREIGN KEY (chat_id) REFERENCES chat(id)
);

-- Criando a tabela Meeting (mapeada explicitamente como 'meetings', ID como String no Java)
CREATE TABLE meetings (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_remote BOOLEAN NOT NULL,
    meeting_link BOOLEAN,
    location VARCHAR(255),
    organizer_id UUID NOT NULL,
    FOREIGN KEY (organizer_id) REFERENCES servidor_publico(id)
);

-- Tabela de relacionamento ManyToMany de reuniões
CREATE TABLE meeting_participants (
    meeting_id VARCHAR(36) NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (meeting_id, user_id),
    FOREIGN KEY (meeting_id) REFERENCES meetings(id),
    FOREIGN KEY (user_id) REFERENCES servidor_publico(id)
);


-- =========================================================================
-- 1. POPULANDO DEPARTAMENTOS
-- =========================================================================
INSERT INTO department (id, name, code) VALUES
('a1111111-1111-1111-1111-111111111111', 'Tecnologia da Informação', 'TI-01'),
('a2222222-2222-2222-2222-222222222222', 'Recursos Humanos', 'RH-02'),
('a3333333-3333-3333-3333-333333333333', 'Financeiro', 'FIN-03'),
('a4444444-4444-4444-4444-444444444444', 'Jurídico', 'JUR-04'),
('a5555555-5555-5555-5555-555555555555', 'Comunicação e Marketing', 'COM-05');

-- =========================================================================
-- 2. POPULANDO USUÁRIOS (SERVIDOR PÚBLICO) COM O NOVO HASH E TELEFONES
-- =========================================================================
INSERT INTO servidor_publico (id, name, email, password, phone, active, created_at, department_id, managed_department_id) VALUES
('b1111111-1111-1111-1111-111111111111', 'Alice Silva', 'alice@siscom.gov.br', '{bcrypt}$2a$10$/rj3agJXoSvgqsUZ1F9tvubBCs6h8xEKRnmnLNgcK3Al.P7.4yBzy', '(11) 98888-1111', TRUE, NOW(), 'a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111'), -- Gerente de TI
('b2222222-2222-2222-2222-222222222222', 'Bruno Souza', 'bruno@siscom.gov.br', '{bcrypt}$2a$10$/rj3agJXoSvgqsUZ1F9tvubBCs6h8xEKRnmnLNgcK3Al.P7.4yBzy', '(11) 98888-2222', TRUE, NOW(), 'a2222222-2222-2222-2222-222222222222', NULL),
('b3333333-3333-3333-3333-333333333333', 'Carla Dias', 'carla@siscom.gov.br', '{bcrypt}$2a$10$/rj3agJXoSvgqsUZ1F9tvubBCs6h8xEKRnmnLNgcK3Al.P7.4yBzy', '(11) 98888-3333', TRUE, NOW(), 'a3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333'), -- Gerente Fin.
('b4444444-4444-4444-4444-444444444444', 'Daniel Oliveira', 'daniel@siscom.gov.br', '{bcrypt}$2a$10$/rj3agJXoSvgqsUZ1F9tvubBCs6h8xEKRnmnLNgcK3Al.P7.4yBzy', '(11) 98888-4444', TRUE, NOW(), 'a4444444-4444-4444-4444-444444444444', NULL),
('b5555555-5555-5555-5555-555555555555', 'Eduarda Lima', 'eduarda@siscom.gov.br', '{bcrypt}$2a$10$/rj3agJXoSvgqsUZ1F9tvubBCs6h8xEKRnmnLNgcK3Al.P7.4yBzy', '(11) 98888-5555', FALSE, NOW(), 'a5555555-5555-5555-5555-555555555555', NULL);

-- Roles dos Usuários
INSERT INTO user_roles (user_id, role_name) VALUES
('b1111111-1111-1111-1111-111111111111', 'ROLE_ADMIN'),
('b1111111-1111-1111-1111-111111111111', 'ROLE_USER'),
('b2222222-2222-2222-2222-222222222222', 'ROLE_USER'),
('b3333333-3333-3333-3333-333333333333', 'ROLE_MANAGER'),
('b4444444-4444-4444-4444-444444444444', 'ROLE_USER'),
('b5555555-5555-5555-5555-555555555555', 'ROLE_USER');

-- =========================================================================
-- 3. POPULANDO CHATS
-- =========================================================================
INSERT INTO chat (id, subject, urgency, requester_id, requested_department_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'Problema com o Email Institucional', 'HIGH', 'b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111'),
('c2222222-2222-2222-2222-222222222222', 'Dúvida sobre Folha de Pagamento', 'MEDIUM', 'b1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333'),
('c3333333-3333-3333-3333-333333333333', 'Revisão de Contrato de Software', 'HIGH', 'b1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444'),
('c4444444-4444-4444-4444-444444444444', 'Solicitação de Novo Crachá', 'LOW', 'b4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222'),
('c5555555-5555-5555-5555-555555555555', 'Divulgação de Evento Interno', 'LOW', 'b3333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555');

-- Participantes dos Chats
INSERT INTO chat_participants (chat_id, user_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222'),
('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111'),
('c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111'),
('c2222222-2222-2222-2222-222222222222', 'b3333333-3333-3333-3333-333333333333'),
('c3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111'),
('c3333333-3333-3333-3333-333333333333', 'b4444444-4444-4444-4444-444444444444'),
('c4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444'),
('c4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222'),
('c5555555-5555-5555-5555-555555555555', 'b3333333-3333-3333-3333-333333333333'),
('c5555555-5555-5555-5555-555555555555', 'b5555555-5555-5555-5555-555555555555');

-- =========================================================================
-- 4. POPULANDO MENSAGENS
-- =========================================================================
INSERT INTO message (id, content, timestamp, is_read, deleted, sender_id, chat_id) VALUES
('d1111111-1111-1111-1111-111111111111', 'Olá, não estou recebendo emails externos.', NOW() - INTERVAL '1 HOUR', TRUE, FALSE, 'b2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111'),
('d2222222-2222-2222-2222-222222222222', 'Vou verificar as configurações do servidor.', NOW(), FALSE, FALSE, 'b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111'),
('d3333333-3333-3333-3333-333333333333', 'Quando sai o retroativo do bônus?', NOW() - INTERVAL '2 DAY', TRUE, FALSE, 'b1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222'),
('d4444444-4444-4444-4444-444444444444', 'O contrato foi enviado para a fila de análise.', NOW() - INTERVAL '5 HOUR', TRUE, FALSE, 'b4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333'),
('d5555555-5555-5555-5555-555555555555', 'O banner do evento ficou ótimo.', NOW() - INTERVAL '10 MINUTE', FALSE, FALSE, 'b3333333-3333-3333-3333-333333333333', 'c5555555-5555-5555-5555-555555555555');

-- =========================================================================
-- 5. POPULANDO REUNIÕES (MEETINGS)
-- =========================================================================
INSERT INTO meetings (id, title, description, start_time, end_time, is_remote, meeting_link, location, organizer_id) VALUES
('meet-00001', 'Alinhamento de Infraestrutura', 'Discussão sobre migração cloud.', NOW() + INTERVAL '1 DAY', NOW() + INTERVAL '1 DAY 2 HOUR', TRUE, TRUE, NULL, 'b1111111-1111-1111-1111-111111111111'),
('meet-00002', 'Integração de Novos Servidores', 'Boas-vindas à equipe.', NOW() + INTERVAL '2 DAY', NOW() + INTERVAL '2 DAY 1 HOUR', FALSE, FALSE, 'Auditório Principal', 'b2222222-2222-2222-2222-222222222222'),
('meet-00003', 'Fechamento de Orçamento', 'Revisão das metas trimestrais.', NOW() + INTERVAL '3 DAY', NOW() + INTERVAL '3 DAY 3 HOUR', TRUE, TRUE, NULL, 'b3333333-3333-3333-3333-333333333333'),
('meet-00004', 'Briefing de Nova Campanha', 'Alinhamento sobre a identidade visual do app.', NOW() + INTERVAL '4 DAY', NOW() + INTERVAL '4 DAY 1 HOUR', TRUE, FALSE, NULL, 'b5555555-5555-5555-5555-555555555555'),
('meet-00005', 'Auditoria Jurídica Interna', 'Discussão de processos abertos.', NOW() - INTERVAL '1 DAY', NOW() - INTERVAL '1 DAY -2 HOUR', FALSE, FALSE, 'Sala de Reuniões B', 'b4444444-4444-4444-4444-444444444444');

-- Participantes das Reuniões
INSERT INTO meeting_participants (meeting_id, user_id) VALUES
('meet-00001', 'b1111111-1111-1111-1111-111111111111'),
('meet-00001', 'b2222222-2222-2222-2222-222222222222'),
('meet-00002', 'b2222222-2222-2222-2222-222222222222'),
('meet-00002', 'b4444444-4444-4444-4444-444444444444'),
('meet-00003', 'b3333333-3333-3333-3333-333333333333'),
('meet-00003', 'b1111111-1111-1111-1111-111111111111'),
('meet-00004', 'b5555555-5555-5555-5555-555555555555'),
('meet-00005', 'b4444444-4444-4444-4444-444444444444'),
('meet-00005', 'b1111111-1111-1111-1111-111111111111');