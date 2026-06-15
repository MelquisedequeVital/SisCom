import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login.guard';
import { InboxComponent } from './components/inbox-component/inbox-component';
import { Form } from './components/inbox-component/newChatForm/form';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Cadastro } from './components/cadastro/cadastro';
import { MeetingModalComponent } from './components/calendar/meeting-modal/meeting-modal';
import { Calendar } from './components/calendar/calendar';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./components/admin-component/admin.routes').then(m => m.ADMIN_ROUTES),
        title: 'Admin',
        canActivate: [AuthGuard],
        data: { requireAdmin: true }
    },
    {
        path: 'chats',
        component: InboxComponent,
        title: 'Inbox'
    },
    {
        path: 'request',
        component: Form,
        title: "Requerer Novo Chat"
    },
    {
        path: 'chats/:id',
        component: InboxComponent
    },

    { 
        path: 'login', 
        component: Login,
        canActivate: [LoginGuard]
    },
  
    { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    
    {
        path: 'dashboard', 
        component: Dashboard,
        canActivate: [AuthGuard],
        data: { requireManager: true }
    },

    { 
        path: 'cadastro', 
        component: Cadastro 
    },
    {
        path: 'meetings',
        component: Calendar
    }
];
