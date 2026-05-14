import { http, HttpResponse, JsonBodyType } from 'msw';

// --- Helpers de Banco ---
export const db = {
    get: <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]'),
    set: <T>(key: string, data: T[]): void => localStorage.setItem(key, JSON.stringify(data))
};

// --- Fábricas de Handlers ---

export const Get = <T>(url: string, dbKey: string) =>
    http.get(url, () => HttpResponse.json(db.get<T>(dbKey)));

export const GetById = <T extends { id: string | number }>(url: string, dbKey: string) =>
    http.get(`${url}/:id`, ({ params }) => {
        const item = db.get<T>(dbKey).find(i => String(i.id) === params['id']);
        return item ? HttpResponse.json(item) : HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    });

export const Post = <T extends JsonBodyType>(url: string, dbKey: string) =>
    http.post(url, async ({ request }) => {
        const newItem = (await request.json()) as T;
        const data = db.get<T>(dbKey);
        data.push(newItem);
        db.set(dbKey, data);
        return HttpResponse.json(newItem, { status: 201 });
    });

export const Put = <T extends { id: string | number }>(url: string, dbKey: string) =>
    http.put(`${url}/:id`, async ({ params, request }) => {
        const updated = (await request.json()) as Partial<T>;
        const data = db.get<T>(dbKey);
        const idx = data.findIndex(i => String(i.id) === params['id']);
        if (idx === -1) return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
        data[idx] = { ...data[idx], ...updated, id: params['id'] } as T;
        db.set(dbKey, data);
        return HttpResponse.json(data[idx]);
    });

export const Delete = <T extends { id: string | number }>(url: string, dbKey: string) =>
    http.delete(`${url}/:id`, ({ params }) => {
        const data = db.get<T>(dbKey);
        const filtered = data.filter(i => String(i.id) !== params['id']);
        db.set(dbKey, filtered);
        return new HttpResponse(null, { status: 204 });
    });