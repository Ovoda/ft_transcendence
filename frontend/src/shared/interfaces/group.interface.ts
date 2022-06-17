import UserRole from "./role.interface";

export default interface Group {
	id: string;
	name: string;
	lastMessage: string;
	password: string;
	users: UserRole[];
	groupAvatar: string;
}