import Room from "src/shared/interfaces/Room.interface";
import { UserRoleEnum } from "../enums/userRole.enum";
import UserData from "./user.interface";

export default interface UserRole {
    id: string;
    role: UserRoleEnum;
    user: UserData;
    chatroom: Room;
    connected: boolean;
}