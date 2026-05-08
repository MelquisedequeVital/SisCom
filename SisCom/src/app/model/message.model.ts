export interface Message {
    id: string;
    content: string;
    senderID: string;
    timestamp: Date;
    isRead: boolean
}
