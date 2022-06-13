import UserRole from "./role.interface";
import UserRelation from "./userRelation";

export default interface GroupMessage {
    id?: string;
    date: string;
    login: string;
    avatar: string;
    content: string;
    role: UserRole;
}