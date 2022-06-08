import Message from "src/shared/interfaces/Message";
import UserRelation from "src/shared/interfaces/userRelation";

export enum e_roomtype {
	DM = 'DM',
	ROOM = 'ROOM',
}

export default interface Chat {
	currentRole: string;
	displayChatBox: boolean;
	currentRelation: UserRelation | null;
	currentLastMessage: string;
	displayRoomCreationModal: boolean,
	messages: Message[];
	currentRoom: string;
}