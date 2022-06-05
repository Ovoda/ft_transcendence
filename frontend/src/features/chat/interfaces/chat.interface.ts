import Message from "src/shared/interfaces/Message";

export enum e_roomtype {
	DM = 'DM',
	ROOM = 'ROOM',
}

export default interface Chat {
	displayChatSelector: boolean;
	roomtype: e_roomtype;
	displayChat: boolean;
	displayOptions: boolean;
	displayRoomCreationModal: boolean,
	messages: Message[];
	currentRoom: string;
}