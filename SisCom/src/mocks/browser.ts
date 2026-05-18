import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { INITIAL_DEPARTMENTS, INITIAL_USERS } from './initial-data'


if (!localStorage.getItem('departments')) {
    localStorage.setItem('departments', JSON.stringify(INITIAL_DEPARTMENTS))
};

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(INITIAL_USERS))
};

export const worker = setupWorker(...handlers)