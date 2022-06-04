import UserRole from "src/features/user/interfaces/userRole.interface";
import { RoomTypeEnum } from "../enums/RoomType.enum";


export default interface Room {
    id: string;
    lastmessage: string;
    room_type: RoomTypeEnum;
    password: string;
    users: UserRole[];
}