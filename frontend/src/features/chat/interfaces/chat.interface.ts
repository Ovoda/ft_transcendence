export enum e_roomtype {
	DM = 'DM',
	ROOM = 'ROOM',
}

export default interface Chat {
	chatSelector: boolean;
	roomtype: e_roomtype;
	displayChat: boolean;
	displayOptions: boolean;
}