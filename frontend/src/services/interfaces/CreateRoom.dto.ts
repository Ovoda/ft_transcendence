import { RoomTypeEnum } from "src/shared/enums/RoomType.enum";

/**
 * This is the DTO for chat room creation
 * @interface CreateRoomDto
 * @field logins - all the users in the room
 * @field roomType - type of the room
 * @field name - name of the room
 * @field password - (optional) room password 
 */
export default interface CreateRoomDto {
    logins: string[];
    roomType: RoomTypeEnum;
    name: string;
    password?: string;
}