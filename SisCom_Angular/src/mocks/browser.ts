import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { INITIAL_CHATS, INITIAL_DEPARTMENTS, INITIAL_MEETINGS, INITIAL_USERS } from './initial-data'
import { hashSync } from 'bcryptjs'


// Reinitialize mock data on every development startup so the login dataset is consistent.
const seededUsers = INITIAL_USERS.map(u => ({
	...u,
	// if password already looks hashed (starts with $2), keep it
	password: String(u.password).startsWith('$2') ? String(u.password) : hashSync(String(u.password), 10)
} as any));

localStorage.setItem('departments', JSON.stringify(INITIAL_DEPARTMENTS));
localStorage.setItem('users', JSON.stringify(seededUsers));
localStorage.setItem('chats', JSON.stringify(INITIAL_CHATS));
localStorage.setItem('meetings', JSON.stringify(INITIAL_MEETINGS));


export const worker = setupWorker(...handlers)