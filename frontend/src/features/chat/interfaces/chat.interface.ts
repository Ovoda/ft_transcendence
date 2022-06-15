import Dm from "src/shared/interfaces/dm.interface";
import GroupMessage from "src/shared/interfaces/groupMessage.interface";
import UserRole from "src/shared/interfaces/role.interface";
import UserRelation from "src/shared/interfaces/userRelation";

export enum e_roomtype {
	DM = 'DM',
	ROOM = 'ROOM',
}

export default interface Chat {
	currentRole: UserRole | null;
	displayChatBox: boolean;
	openSettings: boolean;
	currentRelation: UserRelation | null;
	currentLastMessage: string;
	displayRoomCreationModal: boolean,
	messages: GroupMessage[] | Dm[];
	currentRoom: string;
}