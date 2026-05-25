import { Routes } from '@angular/router';
import { AdminComponent } from './admin-component/admin.component';
import { InboxComponent } from './inbox-component/inbox-component';
import { Form } from './inbox-component/newChatForm/form';
import { Login } from './components/login/login';
import {Dashboard} from './components/dashboard/dashboard';
import { Calendar } from './components/calendar/calendar';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./admin-component/admin.routes').then(m => m.ADMIN_ROUTES), 
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
        path: 'calendar',
        component: Calendar,
        title: 'Calendário'
    },

    {   path: 'login', 
        component: Login,
        title: 'login' 
    },
  
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    //{path : 'calendar', redirectTo: 'calendar', pathMatch: 'full'},
    //{path: 'dashboard', component: Dashboard}
];
