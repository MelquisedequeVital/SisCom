import * as handleFactory from './handler-factory';
import { http, HttpResponse, JsonBodyType } from 'msw';

const BASE_URL = 'http://localhost:4200';

const urlUsers = `${BASE_URL}/api/users`;
const DB_USER_KEY = 'users';

const urlChats = `${BASE_URL}/api/chats`;
const DB_CHAT_KEY = 'chats';

const urlMeetings = `${BASE_URL}/api/meetings`;
const DB_MEETING_KEY = 'meetings';

const urlDepartments = `${BASE_URL}/api/departments`;
const DB_DEPARTMENT_KEY = 'departments';

const urlLogin = `${BASE_URL}/api/login`;

export const handlers = [
    handleFactory.Get(urlUsers, DB_USER_KEY),
    handleFactory.GetById(urlUsers, DB_USER_KEY),
    handleFactory.Post(urlUsers, DB_USER_KEY),
    handleFactory.Put(urlUsers, DB_USER_KEY),
    handleFactory.Delete(urlUsers, DB_USER_KEY),

    handleFactory.Get(urlChats, DB_CHAT_KEY),
    handleFactory.GetById(urlChats, DB_CHAT_KEY),
    handleFactory.Post(urlChats, DB_CHAT_KEY),
    handleFactory.Put(urlChats, DB_CHAT_KEY),
    handleFactory.Delete(urlChats, DB_CHAT_KEY),
    
    handleFactory.Get(urlMeetings, DB_MEETING_KEY),
    handleFactory.GetById(urlMeetings, DB_MEETING_KEY),
    handleFactory.Post(urlMeetings, DB_MEETING_KEY),
    handleFactory.Put(urlMeetings, DB_MEETING_KEY),
    handleFactory.Delete(urlMeetings, DB_MEETING_KEY),

    handleFactory.Get(urlDepartments, DB_DEPARTMENT_KEY),
    handleFactory.GetById(urlDepartments, DB_DEPARTMENT_KEY),
    handleFactory.Post(urlDepartments, DB_DEPARTMENT_KEY),
    handleFactory.Put(urlDepartments, DB_DEPARTMENT_KEY),
    handleFactory.Delete(urlDepartments, DB_DEPARTMENT_KEY),
    
    http.post(urlLogin, async ({ request }) => {
        const credentials = (await request.json()) as any;
        
        const users = handleFactory.db.get<any>(DB_USER_KEY);
        
        const user = users.find((u:any) => u.email === credentials.email && u.password === credentials.password);

        if (user) {
            return HttpResponse.json(user, { status: 200 });
        } else {
            return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
        }
    })
];
