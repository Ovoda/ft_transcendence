import Message from "src/shared/interfaces/Message";

export enum e_roomtype {
	DM = 'DM',
	ROOM = 'ROOM',
}

export default interface Chat {
	displayChatSelector: boolean;
	currentRole: string;
	roomtype: e_roomtype;
	displayChat: boolean;
	displayOptions: boolean;
	currentLastMessage: string;
	displayRoomCreationModal: boolean,
	messages: Message[];
	currentRoom: string;
}