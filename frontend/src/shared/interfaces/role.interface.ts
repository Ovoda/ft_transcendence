import { RoleTypeEnum } from "enums/roleType.enum";
import UserData from "features/user/interfaces/user.interface";
import Group from "./group.interface";

export default interface UserRole {
    id: string;
    expires?: Date;
    role: RoleTypeEnum;
    user: UserData;
    chatGroup: Group;
}