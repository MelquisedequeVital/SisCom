import { User } from './user.model'';

export interface Meeting {
	id: string;
	startTime: Date;
	endTime: Date;
	title: string;
	description?: string;
	participants: User[];
	location?: string;
	isRemote: boolean;
	meetingLink?: boolean;
	organizer: User
}
