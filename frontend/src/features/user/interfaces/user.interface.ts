import UserRole from "src/shared/interfaces/role.interface";
import UserRelation from "src/shared/interfaces/userRelation";

export default interface UserData {
	id: string;
	login: string;
	avatar: string;
	tfaEnabled: boolean;
	roles: UserRole[];
	victories: number;
	defeats: number;
	relations: UserRelation[];
}