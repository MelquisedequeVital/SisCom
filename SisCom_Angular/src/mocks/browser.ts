import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { INITIAL_CHATS, INITIAL_DEPARTMENTS, INITIAL_MEETINGS, INITIAL_USERS } from './initial-data'


if (!localStorage.getItem('departments')) {
    localStorage.setItem('departments', JSON.stringify(INITIAL_DEPARTMENTS))
};

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(INITIAL_USERS))
};

if (!localStorage.getItem('chats')) {
    localStorage.setItem('chats', JSON.stringify(INITIAL_CHATS))
};

if (!localStorage.getItem('meetings')) {
    localStorage.setItem('meetings', JSON.stringify(INITIAL_MEETINGS))
};

export const worker = setupWorker(...handlers)