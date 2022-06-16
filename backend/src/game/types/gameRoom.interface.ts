export class GameRoom {
	id: string;
	status: boolean;
	user1: string;
	user2: string;
	login1: string;
	login2: string;
	socket1: string;
	socket2: string;
	watchers: string[];
	hard?: boolean;
	long?: boolean;
	spin?: boolean;
}
