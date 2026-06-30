import { Routes } from '@angular/router';
import { InboxComponent } from './components/inbox-component/inbox-component';
import { Form } from './components/inbox-component/newChatForm/form';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Cadastro } from './components/cadastro/cadastro';
import { MeetingModalComponent } from './components/calendar/meeting-modal/meeting-modal';
import { Calendar } from './components/calendar/calendar';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    // 1. Rotas Públicas (Acessíveis sem login)
    {
        path: 'login',
        component: Login,
        title: 'Login'
    },
    {
        path: 'cadastro',
        component: Cadastro,
        title: 'Cadastro'
    },

    // 2. Rotas Protegidas (Requerem autenticação)
    {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard',
        canActivate: [authGuard]
    },
    {
        path: 'chats',
        component: InboxComponent,
        title: 'Inbox',
        canActivate: [authGuard]
    },
    {
        path: 'chats/:id',
        component: InboxComponent,
        canActivate: [authGuard]
    },
    {
        path: 'request',
        component: Form,
        title: 'Requerer Novo Chat',
        canActivate: [authGuard]
    },
    {
        path: 'meetings',
        component: Calendar,
        title: 'Reuniões',
        canActivate: [authGuard]
    },

    // 3. Rota Administrativa (Requer ser Admin)
    {
        path: 'admin',
        loadChildren: () => import('./components/admin-component/admin.routes').then(m => m.ADMIN_ROUTES),
        title: 'Admin',
        canActivate: [authGuard, adminGuard]
    },

    // 4. Redirecionamentos e rota curinga 
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
