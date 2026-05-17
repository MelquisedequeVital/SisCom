import { Message } from './message.model';
import { User } from './user.model';


export interface Chat {
    id: string;
    messages: Message[]
    subject:string;
    participants: User[];
    lastMessage?: Message; // Útil para mostrar o resumo na lista de conversas
    urgency: 'low' | 'moderate' | 'high'
}
