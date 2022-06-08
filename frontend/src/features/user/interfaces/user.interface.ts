import UserRelation from "../../../shared/interfaces/userRelation";
import UserRole from "./userRole.interface";

export default interface UserData {
    id: string;
    login: string;
    avatar: string;
    tfaEnabled: boolean;
}