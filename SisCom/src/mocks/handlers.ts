import * as handleFactory from './handler-factory';

const BASE_URL = 'http://localhost:4200';
const urlUsers = `${BASE_URL}/api/users`;
const DB_USER_KEY = 'users';
const urlChats = `${BASE_URL}/api/chats`;
const DB_CHAT_KEY = 'chats';

export const handlers = [

    // Comandos HTTP para  /api/users
    handleFactory.Get(urlUsers, DB_USER_KEY),
    handleFactory.GetById(urlUsers, DB_USER_KEY),
    handleFactory.Post(urlUsers, DB_USER_KEY),
    handleFactory.Put(urlUsers, DB_USER_KEY),
    handleFactory.Delete(urlUsers, DB_USER_KEY),

    // Comandos HTTP para  /api/chats
    handleFactory.Get(urlChats, DB_CHAT_KEY),
    handleFactory.GetById(urlChats, DB_CHAT_KEY),
    handleFactory.Post(urlChats, DB_CHAT_KEY),
    handleFactory.Put(urlChats, DB_CHAT_KEY),
    handleFactory.Delete(urlChats, DB_CHAT_KEY),

]