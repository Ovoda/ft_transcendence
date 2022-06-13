import UserRole from "./role.interface";

export default interface Group {
	id: string;
	name: string;
	lastmessage: string;
	password: string;
	users: UserRole[];
}