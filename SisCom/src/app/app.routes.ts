import { Routes } from '@angular/router';
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
        title: 'Admin'
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
        component: Login 
    },
  
    { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    
    {
        path: 'dashboard', 
        component: Dashboard
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
