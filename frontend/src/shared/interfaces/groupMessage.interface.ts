import UserRole from "./role.interface";
import UserRelation from "./userRelation";

export default interface GroupMessage {
    id?: string;
    date: string;
    username: string;
    avatar: string;
    userId: string;
    content: string;
    role: UserRole;
}