import { http, HttpResponse, PathParams } from 'msw';
import { User } from '../app/models/user.model';

const urlUsers = '/api/users';

const getStoredUsers = (dbKey: string) => {
    const data = localStorage.getItem(dbKey);
    return data ? JSON.parse(data) : [];
};

export const handlers = [



    // Comandos HTTP para  /api/users

    http.get(urlUsers, () => {
        const users = getStoredUsers(urlUsers);
        return HttpResponse.json(users)
    }),

    http.get<{ id: string }>(`${urlUsers}/:id`, ({ params }) => {
        const { id } = params;
        const users: User[] = getStoredUsers(urlUsers);
        const user = users.find(u => u.id === id);

        if (!user) {
            return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 });
        }
        return HttpResponse.json(user);
    }),

    http.post(urlUsers, async ({ request }) => {
        const newUser = (await request.json()) as User;
        const users = getStoredUsers(urlUsers);
        users.push(newUser);

        localStorage.setItem('users', JSON.stringify(users));

        return HttpResponse.json(newUser, { status: 201 });
    }),

    http.delete<{ id: string }>(`${urlUsers}/:id`, ({ params }) => {
        const { id } = params;
        let users: User[] = getStoredUsers(urlUsers);

        const userExists = users.some(u => u.id === id);
        if (!userExists) {
            return HttpResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
        }

        users = users.filter(u => u.id !== id);
        localStorage.setItem(urlUsers, JSON.stringify(users));

        return new HttpResponse(null, { status: 204 });
    }),

    http.put<{ id: string }>(`${urlUsers}/:id`, async ({ params, request }) => {
        const id = params['id'] as string;
        const updatedData = (await request.json()) as User;

        let users: User[] = getStoredUsers(urlUsers);
        const index = users.findIndex(u => u.id === id);

        if (index === -1) {
            return HttpResponse.json(
                { message: 'Usuário não localizado no sistema SisCom' },
                { status: 404 }
            );
        }

        users[index] = { ...users[index], ...updatedData, id };
        localStorage.setItem(urlUsers, JSON.stringify(users));

        return HttpResponse.json(users[index], { status: 200 });
    })
]